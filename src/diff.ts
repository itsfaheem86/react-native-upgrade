import fs from "node:fs";
import https from "node:https";
import path from "node:path";

export const extractVersion = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }
  const match = value.match(/\d+\.\d+\.\d+/);
  return match?.[0];
};

export const buildCompareUrl = (from: string, to: string): string => {
  const base =
    "https://github.com/react-native-community/rn-diff-purge/compare";
  return `${base}/release/${from}..release/${to}`;
};

export const fetchDiffToFile = async (
  compareUrl: string,
  outputPath: string,
): Promise<void> => {
  const diffUrl = `${compareUrl}.diff`;
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
