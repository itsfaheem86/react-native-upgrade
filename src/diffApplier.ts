import fs from "node:fs";
import path from "node:path";
import { DiffFile } from "./diffParser";

export const applyDiffFile = (file: DiffFile, projectRoot: string): string => {
  const filePath = path.join(projectRoot, file.path);

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

export const applyDiff = (
  diffFiles: DiffFile[],
  projectRoot: string,
): string[] => {
  const results: string[] = [];

  for (const file of diffFiles) {
    try {
      const result = applyDiffFile(file, projectRoot);
      results.push(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      results.push(`Error applying ${file.path}: ${message}`);
    }
  }

  return results;
};
