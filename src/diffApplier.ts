import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { DiffFile } from "./diffParser";

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
    // TODO: Use AI to intelligently apply modifications to the file
    // For now, this operation is skipped
    return `File modify skipped (TODO: implement AI-powered modifi​cation): ${file.path}`;
  }

  return `Unknown operation for ${file.path}`;
};

export const applyDiff = async (
  diffFiles: DiffFile[],
  projectRoot: string,
  options: {
    targetVersion?: string;
  } = {},
): Promise<string[]> => {
  const results: string[] = [];

  for (const file of diffFiles) {
    try {
      const result = await applyDiffFile(
        file,
        projectRoot,
        options.targetVersion,
      );
      results.push(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      results.push(`Error applying ${file.path}: ${message}`);
    }
  }

  return results;
};
