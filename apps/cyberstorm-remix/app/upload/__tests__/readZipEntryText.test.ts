import { describe, expect, it } from "vitest";

import { readZipEntryText, readZipFilenames } from "../readZipFilenames";
import { deflatedEntry, storedEntry, zipFile } from "./zipFixtures";

const MANIFEST = JSON.stringify({ name: "MyMod", version_number: "1.0.0" });

describe("readZipEntryText", () => {
  it("reads a stored entry", async () => {
    const file = zipFile(["manifest.json", "README.md"], "package.zip", {
      "manifest.json": storedEntry(MANIFEST),
    });
    await expect(readZipEntryText(file, "manifest.json")).resolves.toBe(
      MANIFEST
    );
  });

  it("inflates a deflated entry", async () => {
    const file = zipFile(["README.md", "manifest.json"], "package.zip", {
      "README.md": storedEntry("# Readme"),
      "manifest.json": await deflatedEntry(MANIFEST),
    });
    await expect(readZipEntryText(file, "manifest.json")).resolves.toBe(
      MANIFEST
    );
  });

  it("leaves filename listing intact for archives with content", async () => {
    const file = zipFile(["manifest.json", "icon.png"], "package.zip", {
      "manifest.json": storedEntry(MANIFEST),
    });
    await expect(readZipFilenames(file)).resolves.toEqual([
      "manifest.json",
      "icon.png",
    ]);
  });

  it("matches the entry name exactly", async () => {
    const file = zipFile(["Manifest.json"], "package.zip", {
      "Manifest.json": storedEntry(MANIFEST),
    });
    await expect(readZipEntryText(file, "manifest.json")).resolves.toBeNull();
  });

  it("returns null for an unsupported compression method", async () => {
    const file = zipFile(["manifest.json"], "package.zip", {
      "manifest.json": { ...storedEntry(MANIFEST), method: 12 },
    });
    await expect(readZipEntryText(file, "manifest.json")).resolves.toBeNull();
  });

  it("returns null when the declared size runs past the archive", async () => {
    const entry = storedEntry(MANIFEST);
    const file = zipFile(["manifest.json"], "package.zip", {
      "manifest.json": { ...entry, compressedSize: entry.data.length + 5000 },
    });
    await expect(readZipEntryText(file, "manifest.json")).resolves.toBeNull();
  });

  it("returns null for entries above the size cap", async () => {
    const file = zipFile(["manifest.json"], "package.zip", {
      "manifest.json": {
        ...storedEntry(MANIFEST),
        uncompressedSize: 2 * 1024 * 1024,
      },
    });
    await expect(readZipEntryText(file, "manifest.json")).resolves.toBeNull();
  });

  it("returns null for something that is not a ZIP", async () => {
    const file = new File(["zip"], "package.zip", { type: "application/zip" });
    await expect(readZipEntryText(file, "manifest.json")).resolves.toBeNull();
  });
});
