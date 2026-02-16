import fs from "node:fs";
import path from "node:path";

export type DetectedEnvironment = {
  projectRoot: string;
  reactNative?: string;
  reactNativeFromNodeModules?: string;
  kotlin?: string;
  gradle?: string;
  agp?: string;
  hermesEnabled?: boolean;
  notes: string[];
};

const readFileIfExists = (filePath: string): string | undefined => {
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  return fs.readFileSync(filePath, "utf8");
};

const findFirstMatch = (
  value: string,
  patterns: RegExp[],
): string | undefined => {
  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
  return undefined;
};

const parsePackageJson = (
  root: string,
  notes: string[],
): string | undefined => {
  const pkgPath = path.join(root, "package.json");
  const raw = readFileIfExists(pkgPath);

  if (!raw) {
    notes.push("package.json not found.");
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
    notes.push("package.json could not be parsed.");
    return undefined;
  }
};

const parseNodeModulesReactNative = (
  root: string,
  notes: string[],
): string | undefined => {
  const rnPkgPath = path.join(
    root,
    "node_modules",
    "react-native",
    "package.json",
  );
  const raw = readFileIfExists(rnPkgPath);

  if (!raw) {
    notes.push("node_modules/react-native/package.json not found.");
    return undefined;
  }

  try {
    const data = JSON.parse(raw) as { version?: string };
    return data.version;
  } catch (error) {
    notes.push("node_modules/react-native/package.json could not be parsed.");
    return undefined;
  }
};

const parseAndroidBuildGradle = (
  root: string,
  notes: string[],
): { kotlin?: string; agp?: string } => {
  const gradlePath = path.join(root, "android", "build.gradle");
  const raw = readFileIfExists(gradlePath);

  if (!raw) {
    notes.push("android/build.gradle not found.");
    return {};
  }

  const kotlin = findFirstMatch(raw, [
    /kotlinVersion\s*=\s*["']([^"']+)["']/,
    /kotlin_version\s*=\s*["']([^"']+)["']/,
    /ext\.kotlin_version\s*=\s*["']([^"']+)["']/,
  ]);

  const agp = findFirstMatch(raw, [
    /com\.android\.tools\.build:gradle:([0-9.]+)/,
    /classpath\(\s*["']com\.android\.tools\.build:gradle:([0-9.]+)["']\s*\)/,
  ]);

  return { kotlin, agp };
};

const parseGradleWrapper = (
  root: string,
  notes: string[],
): string | undefined => {
  const wrapperPath = path.join(
    root,
    "android",
    "gradle",
    "wrapper",
    "gradle-wrapper.properties",
  );
  const raw = readFileIfExists(wrapperPath);

  if (!raw) {
    notes.push("android/gradle/wrapper/gradle-wrapper.properties not found.");
    return undefined;
  }

  const match = raw.match(/gradle-([0-9.]+)-(all|bin)\.zip/);
  return match?.[1];
};

const parsePodfileHermes = (
  root: string,
  notes: string[],
): boolean | undefined => {
  const podfilePath = path.join(root, "ios", "Podfile");
  const raw = readFileIfExists(podfilePath);

  if (!raw) {
    notes.push("ios/Podfile not found.");
    return undefined;
  }

  const match = raw.match(/hermes_enabled\s*(?:=>|:)\s*(true|false)/i);
  if (!match?.[1]) {
    return undefined;
  }

  return match[1].toLowerCase() === "true";
};

export const detectEnvironment = (
  root: string = process.cwd(),
): DetectedEnvironment => {
  const notes: string[] = [];
  const reactNative = parsePackageJson(root, notes);
  const reactNativeFromNodeModules = parseNodeModulesReactNative(root, notes);
  const { kotlin, agp } = parseAndroidBuildGradle(root, notes);
  const gradle = parseGradleWrapper(root, notes);
  const hermesEnabled = parsePodfileHermes(root, notes);

  return {
    projectRoot: root,
    reactNative,
    reactNativeFromNodeModules,
    kotlin,
    gradle,
    agp,
    hermesEnabled,
    notes,
  };
};
