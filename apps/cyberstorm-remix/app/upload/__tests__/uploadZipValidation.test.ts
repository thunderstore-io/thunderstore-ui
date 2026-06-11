import { describe, expect, it } from "vitest";

import { readZipFilenames } from "../readZipFilenames";
import {
  evaluateZipContents,
  validatePackageZip,
} from "../uploadZipValidation";

const VALID_ROOT = ["manifest.json", "icon.png", "README.md"];

/**
 * Builds a minimal, uncompressed (stored) ZIP containing the given entries
 * with empty contents. Only the structures `readZipFilenames` parses (local
 * headers, central directory, EOCD) are produced — enough to exercise the
 * filename reader without pulling in a ZIP library.
 */
function buildZip(filenames: string[]): Uint8Array<ArrayBuffer> {
  const encoder = new TextEncoder();
  const localChunks: Uint8Array[] = [];
  const centralChunks: Uint8Array[] = [];
  const localOffsets: number[] = [];
  let offset = 0;

  for (const name of filenames) {
    const nameBytes = encoder.encode(name);
    localOffsets.push(offset);

    const local = new Uint8Array(30 + nameBytes.length);
    const view = new DataView(local.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 0x0800, true);
    view.setUint16(26, nameBytes.length, true);
    local.set(nameBytes, 30);

    localChunks.push(local);
    offset += local.length;
  }

  const centralStart = offset;
  filenames.forEach((name, index) => {
    const nameBytes = encoder.encode(name);
    const central = new Uint8Array(46 + nameBytes.length);
    const view = new DataView(central.buffer);
    view.setUint32(0, 0x02014b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 20, true);
    view.setUint16(8, 0x0800, true);
    view.setUint16(28, nameBytes.length, true);
    view.setUint32(42, localOffsets[index], true);
    central.set(nameBytes, 46);

    centralChunks.push(central);
    offset += central.length;
  });
  const centralSize = offset - centralStart;

  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  eocdView.setUint32(0, 0x06054b50, true);
  eocdView.setUint16(8, filenames.length, true);
  eocdView.setUint16(10, filenames.length, true);
  eocdView.setUint32(12, centralSize, true);
  eocdView.setUint32(16, centralStart, true);

  const chunks = [...localChunks, ...centralChunks, eocd];
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const out = new Uint8Array(total);
  let cursor = 0;
  for (const chunk of chunks) {
    out.set(chunk, cursor);
    cursor += chunk.length;
  }
  return out;
}

function zipFile(filenames: string[], name = "package.zip"): File {
  return new File([buildZip(filenames)], name, { type: "application/zip" });
}

describe("evaluateZipContents", () => {
  it("accepts a well-formed package with no warnings or errors", () => {
    const result = evaluateZipContents("package.zip", VALID_ROOT);
    expect(result.warnings).toEqual([]);
    expect(result.errors).toEqual([]);
  });

  it("warns when the file name contains 'test'", () => {
    const result = evaluateZipContents("my-test-mod.zip", VALID_ROOT);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]).toContain("Import local mod");
    expect(result.errors).toEqual([]);
  });

  it("warns about a bundled BepInEx.dll and possible modpack", () => {
    const result = evaluateZipContents("package.zip", [
      ...VALID_ROOT,
      "BepInEx.dll",
    ]);
    expect(result.warnings).toEqual([
      expect.stringContaining("BepInEx.dll"),
      expect.stringContaining("modpack"),
    ]);
    expect(result.errors).toEqual([]);
  });

  it("warns about a bundled Assembly-CSharp.dll", () => {
    const result = evaluateZipContents("package.zip", [
      ...VALID_ROOT,
      "Assembly-CSharp.dll",
    ]);
    expect(result.warnings).toEqual([
      expect.stringContaining("Assembly-CSharp.dll"),
    ]);
    expect(result.errors).toEqual([]);
  });

  it("warns when there are more than eight dll files", () => {
    const dlls = Array.from({ length: 9 }, (_, i) => `lib${i}.dll`);
    const result = evaluateZipContents("package.zip", [...VALID_ROOT, ...dlls]);
    expect(result.warnings).toEqual([
      expect.stringContaining("9 .dll files"),
      expect.stringContaining("modpack"),
    ]);
    expect(result.errors).toEqual([]);
  });

  it("flags case-sensitive root file names as a blocking error", () => {
    const result = evaluateZipContents("package.zip", [
      "Manifest.json",
      "icon.png",
      "README.md",
    ]);
    expect(result.errors).toEqual([expect.stringContaining("case-sensitive")]);
  });

  it("flags wrong file extensions as a blocking error", () => {
    const result = evaluateZipContents("package.zip", [
      "manifest.json",
      "icon.png",
      "readme.txt",
    ]);
    expect(result.errors).toContain(
      "Your manifest.json, icon.png, and README.md files must have the correct file extensions."
    );
  });

  it("flags package files nested under a folder", () => {
    const result = evaluateZipContents("package.zip", [
      "MyMod/manifest.json",
      "MyMod/icon.png",
      "MyMod/README.md",
    ]);
    expect(result.errors).toEqual([
      expect.stringContaining("should be at the root"),
    ]);
  });

  it("flags a partial-root layout where only some files are nested", () => {
    const result = evaluateZipContents("package.zip", [
      "manifest.json",
      "MyMod/icon.png",
      "MyMod/README.md",
    ]);
    expect(result.errors).toContain(
      "Your manifest, icon, and README files should be at the root of the .zip file. You can prevent this by compressing the contents of a folder, rather than the folder itself."
    );
    // The nested icon/README are present, so no missing-file errors.
    expect(result.errors).not.toContain(
      "Your package is missing an icon.png file!"
    );
    expect(result.errors).not.toContain(
      "Your package is missing a README.md file!"
    );
  });

  it("detects wrong-case required files inside a subfolder", () => {
    const result = evaluateZipContents("package.zip", [
      "MyMod/Manifest.json",
      "MyMod/icon.png",
      "MyMod/README.md",
    ]);
    expect(result.errors).toContain(
      "The file names of manifest.json, icon.png, and README.md are case-sensitive."
    );
    expect(result.errors).toContain(
      "Your manifest, icon, and README files should be at the root of the .zip file. You can prevent this by compressing the contents of a folder, rather than the folder itself."
    );
  });

  it("detects a wrong extension inside a subfolder", () => {
    const result = evaluateZipContents("package.zip", [
      "manifest.json",
      "icon.png",
      "MyMod/readme.txt",
    ]);
    expect(result.errors).toContain(
      "Your manifest.json, icon.png, and README.md files must have the correct file extensions."
    );
  });

  it("flags missing required files individually", () => {
    expect(
      evaluateZipContents("package.zip", ["icon.png", "README.md"]).errors
    ).toContain("Your package is missing a manifest.json file!");
    expect(
      evaluateZipContents("package.zip", ["manifest.json", "README.md"]).errors
    ).toContain("Your package is missing an icon.png file!");
    expect(
      evaluateZipContents("package.zip", ["manifest.json", "icon.png"]).errors
    ).toContain("Your package is missing a README.md file!");
  });

  it("flags an extension-less required file", () => {
    const result = evaluateZipContents("package.zip", [
      "manifest",
      "icon.png",
      "README.md",
    ]);
    expect(result.errors).toContain(
      "Your manifest.json, icon.png, or README.md file is missing its file extension."
    );
    expect(result.errors).toContain(
      "Your package is missing a manifest.json file!"
    );
  });

  it("only emits filename warnings when the archive is unreadable", () => {
    const result = evaluateZipContents("broken-test.zip", null);
    expect(result.warnings).toHaveLength(1);
    expect(result.errors).toEqual([]);
  });
});

describe("readZipFilenames", () => {
  it("reads entry names from a real ZIP central directory", async () => {
    const names = await readZipFilenames(zipFile(VALID_ROOT));
    expect(names).toEqual(VALID_ROOT);
  });

  it("reads nested entry names", async () => {
    const entries = ["MyMod/", "MyMod/manifest.json", "MyMod/icon.png"];
    const names = await readZipFilenames(zipFile(entries));
    expect(names).toEqual(entries);
  });

  it("returns null for a non-ZIP file", async () => {
    const file = new File(["not a zip at all"], "package.zip", {
      type: "application/zip",
    });
    expect(await readZipFilenames(file)).toBeNull();
  });

  it("reads a ZIP with trailing bytes after the EOCD", async () => {
    const zip = buildZip(VALID_ROOT);
    const trailing = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
    const file = new File([zip, trailing], "package.zip", {
      type: "application/zip",
    });
    expect(await readZipFilenames(file)).toEqual(VALID_ROOT);
  });

  it("returns null when the central directory is corrupt", async () => {
    const zip = buildZip(VALID_ROOT);
    // Clobber the first central-directory header signature (PK\x01\x02) so the
    // directory no longer parses cleanly.
    for (let i = 0; i < zip.length - 4; i++) {
      if (
        zip[i] === 0x50 &&
        zip[i + 1] === 0x4b &&
        zip[i + 2] === 0x01 &&
        zip[i + 3] === 0x02
      ) {
        zip[i] = 0x00;
        break;
      }
    }
    const file = new File([zip], "package.zip", { type: "application/zip" });
    expect(await readZipFilenames(file)).toBeNull();
  });
});

describe("validatePackageZip", () => {
  it("returns no warnings or errors for a valid package", async () => {
    const result = await validatePackageZip(zipFile(VALID_ROOT));
    expect(result.warnings).toEqual([]);
    expect(result.errors).toEqual([]);
  });

  it("surfaces blocking errors for a package missing its manifest", async () => {
    const result = await validatePackageZip(zipFile(["icon.png", "README.md"]));
    expect(result.errors).toContain(
      "Your package is missing a manifest.json file!"
    );
  });

  it("does not block when the archive cannot be read", async () => {
    const file = new File(["garbage"], "test-mod.zip", {
      type: "application/zip",
    });
    const result = await validatePackageZip(file);
    expect(result.errors).toEqual([]);
    // The file name still triggers the advisory "test" warning.
    expect(result.warnings).toHaveLength(1);
  });
});
