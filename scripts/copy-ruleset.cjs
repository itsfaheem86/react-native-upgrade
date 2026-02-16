const fs = require("node:fs");
const path = require("node:path");

const src = path.join(__dirname, "..", "src", "data", "ruleset.json");
const destDir = path.join(__dirname, "..", "dist", "data");
const dest = path.join(destDir, "ruleset.json");

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);
