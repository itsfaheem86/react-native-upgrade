import fs from "node:fs";
import path from "node:path";

export type DetectedEnvironment = {
  projectRoot: string;
  reactNativeVersion?: string;
  appName?: string;
  appPackage?: string;
};

const readFileIfExists = (filePath: string): string | undefined => {
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  return fs.readFileSync(filePath, "utf8");
};

const parsePackageJson = (root: string): string | undefined => {
  const pkgPath = path.join(root, "package.json");
  const raw = readFileIfExists(pkgPath);

  if (!raw) {
    return undefined;
  }

  try {
    const data = JSON.parse(raw) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    return (
      data.dependencies?.["react-native"] ||
      data.devDependencies?.["react-native"]
    );
  } catch (error) {
    return undefined;
  }
};

const parseAndroidManifest = (root: string): string | undefined => {
  const manifestPath = path.join(
    root,
    "android",
    "app",
    "src",
    "main",
    "AndroidManifest.xml",
  );
  console.log(`Looking for Android package in: ${manifestPath}`);
  const raw = readFileIfExists(manifestPath);

  if (!raw) {
    return undefined;
  }

  const match = raw.match(/package="([^"]+)"/);
  return match?.[1];
};

const parseAppJson = (root: string): string | undefined => {
  const appJsonPath = path.join(root, "app.json");
  const raw = readFileIfExists(appJsonPath);

  if (!raw) {
    return undefined;
  }

  try {
    const data = JSON.parse(raw) as { name?: string };
    return data.name;
  } catch (error) {
    return undefined;
  }
};

const getAppName = (root: string): string | undefined => {
  // Try app.json first
  const appName = parseAppJson(root);
  if (appName) {
    return appName;
  }

  // Fallback to package.json
  const pkgPath = path.join(root, "package.json");
  const raw = readFileIfExists(pkgPath);

  if (!raw) {
    return undefined;
  }

  try {
    const data = JSON.parse(raw) as { name?: string };
    return data.name;
  } catch (error) {
    return undefined;
  }
};

export const detectEnvironment = (
  root: string = process.cwd(),
): DetectedEnvironment => {
  return {
    projectRoot: root,
    reactNativeVersion: parsePackageJson(root),
    appName: getAppName(root),
    appPackage: parseAndroidManifest(root),
  };
};
