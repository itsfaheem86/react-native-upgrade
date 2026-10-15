import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildCompareUrl, extractVersion } from "../src/diff";

describe("extractVersion", () => {
  it("returns the first semver-like version in the string", () => {
    assert.equal(extractVersion("0.76.9"), "0.76.9");
    assert.equal(extractVersion("^0.76.0"), "0.76.0");
    assert.equal(extractVersion("react-native@0.77.1"), "0.77.1");
  });

  it("keeps a prerelease suffix", () => {
    assert.equal(extractVersion("0.88.0-rc.1"), "0.88.0-rc.1");
    assert.equal(extractVersion("^0.88.0-rc.0"), "0.88.0-rc.0");
    assert.equal(extractVersion("0.88.0"), "0.88.0");
  });

  it("returns undefined when there is no version or no input", () => {
    assert.equal(extractVersion(undefined), undefined);
    assert.equal(extractVersion(""), undefined);
    assert.equal(extractVersion("latest"), undefined);
    assert.equal(extractVersion("0.76"), undefined);
  });
});

describe("buildCompareUrl", () => {
  it("builds the rn-diff-purge raw URL for a from..to pair", () => {
    assert.equal(
      buildCompareUrl("0.76.0", "0.77.0"),
      "https://raw.githubusercontent.com/react-native-community/rn-diff-purge/diffs/diffs/0.76.0..0.77.0.diff",
    );
  });
});
