import fs from "node:fs";
import https from "node:https";
import path from "node:path";

export const extractVersion = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }
  // Keep a prerelease suffix (e.g. 0.88.0-rc.1): rn-diff-purge publishes
  // diffs and release branches under that exact name.
  const match = value.match(/\d+\.\d+\.\d+(?:-[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)*)?/);
  return match?.[0];
};

export const buildCompareUrl = (from: string, to: string): string => {
  return `https://raw.githubusercontent.com/react-native-community/rn-diff-purge/diffs/diffs/${from}..${to}.diff`;
};

export const fetchDiffToFile = async (
  diffUrl: string,
  outputPath: string,
): Promise<void> => {
  const resolvedPath = path.resolve(process.cwd(), outputPath);

  await new Promise<void>((resolve, reject) => {
    https
      .get(diffUrl, (res) => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`Failed to fetch diff (${res.statusCode}).`));
          res.resume();
          return;
        }

        const file = fs.createWriteStream(resolvedPath);
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", reject);
  });
};
