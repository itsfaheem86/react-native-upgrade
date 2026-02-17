export type DiffHunk = {
  oldStart: number;
  oldCount: number;
  newStart: number;
  newCount: number;
  lines: string[];
};

export type DiffFile = {
  path: string;
  templatePath: string;
  operation: "add" | "modify" | "delete";
  hunks: DiffHunk[];
  isBinary?: boolean;
};

export type ParsedDiff = {
  files: DiffFile[];
};

export type ParseDiffOptions = {
  appName?: string;
  templateAppName?: string;
  stripAppNameRoot?: boolean;
};

const replaceAppNameInPath = (
  filePath: string,
  appName?: string,
  templateAppName: string = "RnDiffApp",
  stripAppNameRoot: boolean = true,
): string => {
  let updatedPath = filePath;
  if (appName) {
    updatedPath = updatedPath
      .split(templateAppName)
      .join(appName)
      .split(templateAppName.toLowerCase())
      .join(appName.toLowerCase());

    const appRootPrefix = `${appName}/`;
    if (stripAppNameRoot && updatedPath.startsWith(appRootPrefix)) {
      updatedPath = updatedPath.slice(appRootPrefix.length);
    }
  }

  return updatedPath;
};

export const parseDiff = (
  diffContent: string,
  options: ParseDiffOptions = {},
): ParsedDiff => {
  const lines = diffContent.split("\n");
  const files: DiffFile[] = [];
  let currentFile: DiffFile | null = null;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("diff --git")) {
      const match = line.match(/diff --git a\/(.+?) b\/(.+?)$/);
      if (!match) {
        i++;
        continue;
      }

      const aPath = match[1];
      const bPath = match[2];
      let operation: "add" | "modify" | "delete" = "modify";
      let isBinary = false;

      i++;
      while (i < lines.length && !lines[i].startsWith("diff --git")) {
        const headerLine = lines[i];
        if (headerLine.startsWith("new file")) {
          operation = "add";
        } else if (headerLine.startsWith("deleted file")) {
          operation = "delete";
        } else if (headerLine.startsWith("Binary files ")) {
          isBinary = true;
        } else if (headerLine.startsWith("GIT binary patch")) {
          isBinary = true;
        } else if (headerLine.startsWith("@@")) {
          break;
        }
        i++;
      }

      currentFile = {
        path: replaceAppNameInPath(
          bPath,
          options.appName,
          options.templateAppName,
          options.stripAppNameRoot,
        ),
        templatePath: bPath,
        operation,
        hunks: [],
        isBinary,
      };
      files.push(currentFile);
      continue;
    }

    if (currentFile && line.startsWith("Binary files ")) {
      currentFile.isBinary = true;
    }

    if (currentFile && line.startsWith("GIT binary patch")) {
      currentFile.isBinary = true;
    }

    if (currentFile && line.startsWith("@@")) {
      const match = line.match(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
      if (match) {
        const oldStart = parseInt(match[1], 10);
        const oldCount = match[2] ? parseInt(match[2], 10) : 1;
        const newStart = parseInt(match[3], 10);
        const newCount = match[4] ? parseInt(match[4], 10) : 1;

        const hunkLines: string[] = [];
        i++;

        while (
          i < lines.length &&
          !lines[i].startsWith("@@") &&
          !lines[i].startsWith("diff --git")
        ) {
          const hunkLine = lines[i];
          if (
            hunkLine.startsWith("+") ||
            hunkLine.startsWith("-") ||
            hunkLine.startsWith(" ")
          ) {
            hunkLines.push(hunkLine);
          } else if (hunkLine === "\\ No newline at end of file") {
            hunkLines.push(hunkLine);
          }
          i++;
        }

        currentFile.hunks.push({
          oldStart,
          oldCount,
          newStart,
          newCount,
          lines: hunkLines,
        });
        continue;
      }
    }

    i++;
  }

  return { files };
};

export const formatDiffSummary = (diff: ParsedDiff): string => {
  const lines: string[] = [];

  for (const file of diff.files) {
    const opEmoji =
      file.operation === "add"
        ? "✨"
        : file.operation === "delete"
          ? "🗑️"
          : "📝";
    const binaryLabel = file.isBinary ? ", binary" : "";
    lines.push(`${opEmoji} ${file.path} (${file.operation}${binaryLabel})`);

    for (const hunk of file.hunks) {
      const additions = hunk.lines.filter((l) => l.startsWith("+")).length;
      const deletions = hunk.lines.filter((l) => l.startsWith("-")).length;
      if (additions > 0 || deletions > 0) {
        lines.push(
          `   Lines ${hunk.oldStart}-${hunk.oldStart + hunk.oldCount - 1}: +${additions}/-${deletions}`,
        );
      }
    }
  }

  return lines.join("\n");
};
