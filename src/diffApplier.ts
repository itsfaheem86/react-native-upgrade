import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { DiffFile } from "./diffParser";

const buildBinaryFileUrl = (version: string, templatePath: string): string =>
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
      const downloadUrl = buildBinaryFileUrl(targetVersion, file.templatePath);
      const dir = path.dirname(filePath);
      fs.mkdirSync(dir, { recursive: true });
      const data = await downloadBinaryFile(downloadUrl);
      fs.writeFileSync(filePath, data);
      return `Downloaded binary: ${file.path}`;
    }

    return `Binary file skipped: ${file.path}`;
  }

  if (file.operation === "add") {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });

    const lines: string[] = [];
    for (const hunk of file.hunks) {
      for (const line of hunk.lines) {
        if (line.startsWith("+")) {
          lines.push(line.slice(1));
        }
      }
    }

    fs.writeFileSync(filePath, lines.join("\n"), "utf8");
    return `Created ${file.path}`;
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

    let content = fs.readFileSync(filePath, "utf8");
    let fileLines = content.split("\n");

    for (const hunk of file.hunks) {
      const newLines: string[] = [];
      let lineIndex = hunk.oldStart - 1;

      const contextBefore = fileLines.slice(0, lineIndex);
      const contextAfter = fileLines.slice(lineIndex + hunk.oldCount);

      for (const diffLine of hunk.lines) {
        if (diffLine.startsWith("-")) {
          lineIndex++;
        } else if (diffLine.startsWith("+")) {
          newLines.push(diffLine.slice(1));
        } else if (diffLine.startsWith(" ")) {
          newLines.push(diffLine.slice(1));
          lineIndex++;
        }
      }

      const updatedContent = [
        ...contextBefore,
        ...newLines,
        ...contextAfter,
      ].join("\n");

      content = updatedContent;
      fileLines = content.split("\n");
    }

    fs.writeFileSync(filePath, content, "utf8");
    return `Modified ${file.path}`;
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
