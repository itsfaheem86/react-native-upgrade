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
  const raw = readFileIfExists(manifestPath);

  if (!raw) {
    return undefined;
  }

  const match = raw.match(/package="([^"]+)"/);
  return match?.[1];
};

const parseBuildGradle = (root: string): string | undefined => {
  const buildGradlePath = path.join(root, "android", "app", "build.gradle");
  const raw = readFileIfExists(buildGradlePath);

  if (!raw) {
    return undefined;
  }

  // Try namespace first (newer Gradle/RN versions)
  const namespaceMatch = raw.match(/namespace\s+["']([^"']+)["']/);
  if (namespaceMatch) {
    return namespaceMatch[1];
  }

  // Fallback to applicationId
  const appIdMatch = raw.match(/applicationId\s+["']([^"']+)["']/);
  return appIdMatch?.[1];
};

const parseMainActivityFile = (root: string): string | undefined => {
  const mainActivityPath = path.join(
    root,
    "android",
    "app",
    "src",
    "main",
    "java",
  );

  if (!fs.existsSync(mainActivityPath)) {
    return undefined;
  }

  const findPackageInFile = (dir: string): string | undefined => {
    try {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          const result = findPackageInFile(filePath);
          if (result) return result;
        } else if (file === "MainActivity.kt" || file === "MainActivity.java") {
          const content = fs.readFileSync(filePath, "utf8");
          // Extract package from Kotlin or Java: package com.example or package com.example;
          const match = content.match(/^\s*package\s+([a-zA-Z0-9_.]+)/m);
          if (match) {
            return match[1];
          }
        }
      }
    } catch (error) {
      return undefined;
    }
    return undefined;
  };

  return findPackageInFile(mainActivityPath);
};

const getAppPackage = (root: string): string | undefined => {
  // Try build.gradle first (most reliable in modern RN)
  const packageFromGradle = parseBuildGradle(root);
  if (packageFromGradle) {
    return packageFromGradle;
  }

  // Try AndroidManifest.xml (common in older RN versions)
  const packageFromManifest = parseAndroidManifest(root);
  if (packageFromManifest) {
    return packageFromManifest;
  }

  // Try MainActivity.kt or MainActivity.java as last resort
  return parseMainActivityFile(root);
};

const parseMainActivityForName = (root: string): string | undefined => {
  const mainActivityPath = path.join(
    root,
    "android",
    "app",
    "src",
    "main",
    "java",
  );

  if (!fs.existsSync(mainActivityPath)) {
    return undefined;
  }

  const findMainActivityName = (dir: string): string | undefined => {
    try {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          const result = findMainActivityName(filePath);
          if (result) return result;
        } else if (file === "MainActivity.kt") {
          const content = fs.readFileSync(filePath, "utf8");
          // Extract app name from getMainComponentName(): String = "appName"
          const match = content.match(
            /getMainComponentName\(\)\s*:\s*String\s*=\s*"([^"]+)"/,
          );
          if (match) {
            return match[1];
          }
        } else if (file === "MainActivity.java") {
          const content = fs.readFileSync(filePath, "utf8");
          // Extract app name from return "appName";
          const match = content.match(
            /getMainComponentName\(\)\s*\{[^}]*return\s+"([^"]+)"/s,
          );
          if (match) {
            return match[1];
          }
        }
      }
    } catch (error) {
      return undefined;
    }
    return undefined;
  };

  return findMainActivityName(mainActivityPath);
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

  // Try package.json
  const pkgPath = path.join(root, "package.json");
  const raw = readFileIfExists(pkgPath);

  if (raw) {
    try {
      const data = JSON.parse(raw) as { name?: string };
      if (data.name) {
        return data.name;
      }
    } catch (error) {
      // Continue to MainActivity fallback
    }
  }

  // Final fallback to MainActivity.kt or MainActivity.java
  return parseMainActivityForName(root);
};

export const detectEnvironment = (
  root: string = process.cwd(),
): DetectedEnvironment => {
  return {
    projectRoot: root,
    reactNativeVersion: parsePackageJson(root),
    appName: getAppName(root),
    appPackage: getAppPackage(root),
  };
};
