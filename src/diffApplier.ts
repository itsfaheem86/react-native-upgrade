import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { execSync } from "node:child_process";
import os from "node:os";
import { DiffFile } from "./diffParser";

// Git 3-way merge to intelligently merge changes while preserving user edits
const mergeWithGit = async (options: {
  original: string;
  target: string;
  userVersion: string;
  filename: string;
}): Promise<string> => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "git-merge-"));

  try {
    const originalFile = path.join(tmpDir, "original");
    const targetFile = path.join(tmpDir, "target");
    const userFile = path.join(tmpDir, "user");

    // Write the three versions to temporary files
    fs.writeFileSync(originalFile, options.original, "utf8");
    fs.writeFileSync(targetFile, options.target, "utf8");
    fs.writeFileSync(userFile, options.userVersion, "utf8");

    // Use git merge-file for 3-way merge
    // Format: git merge-file [options] current_file base other_file
    try {
      execSync(
        `git merge-file -p "${userFile}" "${originalFile}" "${targetFile}"`,
        {
          encoding: "utf8",
          stdio: ["pipe", "pipe", "pipe"],
        },
      );
    } catch (error) {
      // git merge-file exits with code 1 if there are conflicts, which is expected
      if (
        error instanceof Error &&
        (error as any).status !== 1 &&
        (error as any).status !== 0
      ) {
        throw error;
      }
    }

    // Get the merged result
    const result = execSync(
      `git merge-file -p "${userFile}" "${originalFile}" "${targetFile}"`,
      {
        encoding: "utf8",
      },
    );

    return result;
  } finally {
    // Cleanup temporary files
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
};

const buildFileUrl = (version: string, templatePath: string): string =>
  `https://raw.githubusercontent.com/react-native-community/rn-diff-purge/release/${version}/${templatePath}`;

const downloadBinaryFile = (
  url: string,
  redirectsLeft: number = 3,
): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const statusCode = res.statusCode ?? 0;

        if (statusCode >= 300 && statusCode < 400 && res.headers.location) {
          if (redirectsLeft <= 0) {
            reject(new Error(`Too many redirects while downloading ${url}.`));
            res.resume();
            return;
          }

          const redirectedUrl = res.headers.location.startsWith("http")
            ? res.headers.location
            : new URL(res.headers.location, url).toString();
          res.resume();
          downloadBinaryFile(redirectedUrl, redirectsLeft - 1)
            .then(resolve)
            .catch(reject);
          return;
        }

        if (statusCode >= 400) {
          reject(new Error(`Failed to download binary (${statusCode}).`));
          res.resume();
          return;
        }

        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });

export const applyDiffFile = async (
  file: DiffFile,
  projectRoot: string,
  targetVersion?: string,
  fromVersion?: string,
): Promise<string> => {
  const filePath = path.join(projectRoot, file.path);
  const isBinary =
    file.isBinary || (file.hunks.length === 0 && file.operation !== "delete");

  if (file.operation !== "delete" && isBinary) {
    if (targetVersion) {
      const downloadUrl = buildFileUrl(targetVersion, file.templatePath);
      const dir = path.dirname(filePath);
      fs.mkdirSync(dir, { recursive: true });
      const data = await downloadBinaryFile(downloadUrl);
      fs.writeFileSync(filePath, data);
      return `Downloaded binary: ${file.path}`;
    }

    return `Binary file skipped: ${file.path}`;
  }

  if (file.operation === "add") {
    if (targetVersion) {
      const downloadUrl = buildFileUrl(targetVersion, file.templatePath);
      const dir = path.dirname(filePath);
      fs.mkdirSync(dir, { recursive: true });
      const data = await downloadBinaryFile(downloadUrl);
      fs.writeFileSync(filePath, data);
      return `Downloaded file: ${file.path}`;
    }

    return `File add skipped: ${file.path}`;
  }

  if (file.operation === "delete") {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return `Deleted ${file.path}`;
  }

  if (file.operation === "modify") {
    if (!fs.existsSync(filePath)) {
      return `File not found: ${file.path} (skipped)`;
    }

    const userContent = fs.readFileSync(filePath, "utf8");

    // Use Git 3-way merge if both versions are available
    if (targetVersion && fromVersion) {
      try {
        const baseUrl = buildFileUrl(fromVersion, file.templatePath);
        const originalData = await downloadBinaryFile(baseUrl);
        const originalContent = originalData.toString("utf8");

        const targetUrl = buildFileUrl(targetVersion, file.templatePath);
        const targetData = await downloadBinaryFile(targetUrl);
        const targetContent = targetData.toString("utf8");

        const mergedContent = await mergeWithGit({
          original: originalContent,
          target: targetContent,
          userVersion: userContent,
          filename: file.path,
        });

        fs.writeFileSync(filePath, mergedContent, "utf8");
        return `Modified ${file.path} (git 3-way merge)`;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return `Failed to git-merge ${file.path}: ${errorMsg} (skipped)`;
      }
    }

    return `File modify skipped (no version info for git merge): ${file.path}`;
  }

  return `Unknown operation for ${file.path}`;
};

export const applyDiff = async (
  diffFiles: DiffFile[],
  projectRoot: string,
  options: {
    targetVersion?: string;
    fromVersion?: string;
  } = {},
): Promise<string[]> => {
  const results: string[] = [];

  for (const file of diffFiles) {
    try {
      const result = await applyDiffFile(
        file,
        projectRoot,
        options.targetVersion,
        options.fromVersion,
      );
      results.push(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      results.push(`Error applying ${file.path}: ${message}`);
    }
  }

  return results;
};
