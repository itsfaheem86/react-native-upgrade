import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { execSync } from "node:child_process";
import os from "node:os";
import { DiffFile, replaceAppDetailsInContent } from "./diffParser";

// Helper function to search for a file in the project directory
const findFileInProject = (
  projectRoot: string,
  filename: string,
): string | undefined => {
  const searchDir = (dir: string, depth: number = 0): string | undefined => {
    // Limit search depth to avoid performance issues
    if (depth > 10) return undefined;

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        // Skip node_modules, .git, and other common directories
        if (
          entry.isDirectory() &&
          !["node_modules", ".git", "build", "dist", ".gradle"].includes(
            entry.name,
          )
        ) {
          const result = searchDir(fullPath, depth + 1);
          if (result) return result;
        } else if (entry.isFile() && entry.name === path.basename(filename)) {
          return fullPath;
        }
      }
    } catch (error) {
      return undefined;
    }

    return undefined;
  };

  return searchDir(projectRoot);
};

export const mergeWithGit = (options: {
  from: string;
  to: string;
  userContent: string;
  filename: string;
  targetVersion?: string;
  fromVersion?: string;
}): { content: string; hasConflicts: boolean } => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "git-merge-"));

  try {
    const fromFile = path.join(tmpDir, `${options.fromVersion}-version`);
    const toFile = path.join(tmpDir, `${options.targetVersion}-version`);
    const userFile = path.join(tmpDir, `user-version`);

    // git merge-file is line-based and treats CRLF vs LF as different content,
    // so a Windows checkout (CRLF) merged against files downloaded from GitHub
    // (LF) reports the whole file as one giant "conflict" even when nothing
    // meaningful changed. Normalize everything to LF for the merge itself,
    // then restore the user's original line-ending style on the result.
    const userEol = options.userContent.includes("\r\n") ? "\r\n" : "\n";
    const toLf = (content: string) => content.replace(/\r\n/g, "\n");

    // Write the three versions to temporary files
    fs.writeFileSync(fromFile, toLf(options.from), "utf8");
    fs.writeFileSync(toFile, toLf(options.to), "utf8");
    fs.writeFileSync(userFile, toLf(options.userContent), "utf8");

    // Use git merge-file for 3-way merge
    // Format: git merge-file [options] current_file base other_file
    // -L labels the conflict markers so they read "<<<<<<< yours" etc.
    // instead of showing temp file paths.
    let mergeExitCode = 0;
    let mergedResult = "";

    try {
      mergedResult = execSync(
        `git merge-file -p -L "yours" -L "${options.fromVersion}" -L "${options.targetVersion}" "${userFile}" "${fromFile}" "${toFile}"`,
        {
          encoding: "utf8",
        },
      );
    } catch (error) {
      // git merge-file exits with non-zero code if there are conflicts or issues
      // Exit code 1 = conflicts, Exit code 2+ = other issues but may still have output
      if (error instanceof Error && (error as any).status) {
        const exitCode = (error as any).status;
        const stdout = (error as any).stdout || "";

        // If we got output, use it even with exit code 2+
        if (stdout) {
          mergeExitCode = exitCode;
          mergedResult = stdout;
        } else {
          // No output, this is a real error
          throw new Error(
            `git merge-file failed with exit code ${exitCode}: ${(error as any).stderr || error.message}`,
          );
        }
      } else {
        throw error;
      }
    }

    // Restore the user's original line-ending style before writing to disk,
    // so the result doesn't look like every line changed just because we
    // normalized to LF for the merge.
    if (userEol === "\r\n") {
      mergedResult = mergedResult.replace(/\n/g, "\r\n");
    }

    // Conflicts are left in place as standard conflict markers so the user
    // can resolve them later in their editor of choice.
    return { content: mergedResult, hasConflicts: mergeExitCode > 0 };
  } finally {
    // Cleanup temporary files
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
};

const buildFileUrl = (version: string, templatePath: string): string =>
  `https://raw.githubusercontent.com/react-native-community/rn-diff-purge/release/${version}/${templatePath}`;

const downloadFile = (
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
          downloadFile(redirectedUrl, redirectsLeft - 1)
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
  appName?: string,
  appPackage?: string,
): Promise<string> => {
  let filePath = path.join(projectRoot, file.path);

  const baseName = path.basename(file.path);
  if (["App.tsx", "App.js", "App.jsx"].includes(baseName)) {
    return `⏭️  File modify skipped (protected): ${file.path}`;
  }

  const isBinary =
    file.isBinary || (file.hunks.length === 0 && file.operation !== "delete");

  if (file.operation !== "delete" && isBinary) {
    if (targetVersion) {
      const downloadUrl = buildFileUrl(targetVersion, file.templatePath);
      const dir = path.dirname(filePath);
      fs.mkdirSync(dir, { recursive: true });
      const data = await downloadFile(downloadUrl);
      fs.writeFileSync(filePath, data);
      return `📦 Downloaded binary: ${file.path}`;
    }

    return `⏭️  Binary file skipped: ${file.path}`;
  }

  if (file.operation === "add") {
    if (targetVersion) {
      const downloadUrl = buildFileUrl(targetVersion, file.templatePath);
      const dir = path.dirname(filePath);
      fs.mkdirSync(dir, { recursive: true });
      const data = await downloadFile(downloadUrl);
      fs.writeFileSync(
        filePath,
        replaceAppDetailsInContent(data.toString("utf8"), appName, appPackage),
      );
      return `✅ Added file: ${file.path}`;
    }

    return `⏭️  File add skipped: ${file.path}`;
  }

  if (file.operation === "delete") {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return `🗑️  Deleted ${file.path}`;
  }

  if (file.operation === "modify") {
    if (!fs.existsSync(filePath)) {
      // Try to find the file in the project
      console.log(
        `    🔍 File not found at expected path: ${file.path}, searching in project...`,
      );
      const foundPath = findFileInProject(projectRoot, file.path);
      if (foundPath) {
        console.log(`    ✓ Found at: ${foundPath}`);
        filePath = foundPath;
      } else {
        return `❌ File not found: ${file.path} (skipped)`;
      }
    }

    const userContent = fs.readFileSync(filePath, "utf8");

    // Use Git 3-way merge if both versions are available
    if (targetVersion && fromVersion) {
      try {
        const baseUrl = buildFileUrl(fromVersion, file.templatePath);
        const originalData = await downloadFile(baseUrl);
        const fromContent = originalData.toString("utf8");

        const targetUrl = buildFileUrl(targetVersion, file.templatePath);
        const targetData = await downloadFile(targetUrl);
        const toContent = targetData.toString("utf8");

        const { content, hasConflicts } = mergeWithGit({
          from: replaceAppDetailsInContent(fromContent, appName, appPackage),
          to: replaceAppDetailsInContent(toContent, appName, appPackage),
          userContent,
          filename: file.path,
          targetVersion,
          fromVersion,
        });

        fs.writeFileSync(filePath, content, "utf8");
        if (hasConflicts) {
          return `⚠️  Conflicts in ${file.path} (resolve conflict markers manually)`;
        }
        return `🔀 Modified ${file.path} (git 3-way merge)`;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return `❌ Failed to git-merge ${file.path}: ${errorMsg} (skipped)`;
      }
    }

    return `⏭️  File modify skipped (no version info for git merge): ${file.path}`;
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
  appName?: string,
  appPackage?: string,
): Promise<{
  applied: number;
  skipped: number;
  failed: number;
  failedFiles: string[];
  conflictedFiles: string[];
  total: number;
}> => {
  let applied = 0;
  let skipped = 0;
  let failed = 0;
  const failedFiles: string[] = [];
  const conflictedFiles: string[] = [];

  for (const file of diffFiles) {
    try {
      const result = await applyDiffFile(
        file,
        projectRoot,
        options.targetVersion,
        options.fromVersion,
        appName,
        appPackage,
      );
      console.log(`  ${result}`);

      const trimmed = result.trim();
      if (trimmed.startsWith("❌")) {
        failed += 1;
        failedFiles.push(file.path);
      } else if (trimmed.startsWith("⏭️")) {
        skipped += 1;
      } else if (trimmed.startsWith("⚠️")) {
        applied += 1;
        conflictedFiles.push(file.path);
      } else {
        applied += 1;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`Error applying ${file.path}: ${message}`);
      failed += 1;
      failedFiles.push(file.path);
    }
  }

  return {
    applied,
    skipped,
    failed,
    failedFiles,
    conflictedFiles,
    total: diffFiles.length,
  };
};
