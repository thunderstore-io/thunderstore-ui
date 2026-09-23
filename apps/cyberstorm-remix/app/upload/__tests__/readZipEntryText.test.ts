import { describe, expect, it, vi } from "vitest";

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

  it("matches the entry name exactly", async () => {
    const file = zipFile(["Manifest.json"], "package.zip", {
      "Manifest.json": storedEntry(MANIFEST),
    });
    await expect(readZipEntryText(file, "manifest.json")).resolves.toBeNull();
  });

  it("returns null for entries above the size cap", async () => {
    const file = zipFile(["manifest.json"], "package.zip", {
      "manifest.json": await deflatedEntry("x".repeat(1024 * 1024 + 1)),
    });
    await expect(readZipEntryText(file, "manifest.json")).resolves.toBeNull();
  });

  it("accepts a deflated entry exactly at the size cap", async () => {
    const text = "x".repeat(1024 * 1024);
    const file = zipFile(["manifest.json"], "package.zip", {
      "manifest.json": await deflatedEntry(text),
    });
    await expect(readZipEntryText(file, "manifest.json")).resolves.toBe(text);
  });

  it("reads metadata without buffering the package payload", async () => {
    const file = zipFile(["manifest.json", "payload.bin"], "package.zip", {
      "manifest.json": storedEntry(MANIFEST),
      "payload.bin": storedEntry("x".repeat(2 * 1024 * 1024)),
    });
    const wholeFileRead = vi.spyOn(file, "arrayBuffer");
    const slices = vi.spyOn(file, "slice");
    try {
      await expect(readZipFilenames(file)).resolves.toEqual([
        "manifest.json",
        "payload.bin",
      ]);
      await expect(readZipEntryText(file, "manifest.json")).resolves.toBe(
        MANIFEST
      );
      expect(wholeFileRead).not.toHaveBeenCalled();
      const bytesRead = slices.mock.results.reduce(
        (size, result) => size + result.value.size,
        0
      );
      expect(bytesRead).toBeLessThan(192 * 1024);
    } finally {
      wholeFileRead.mockRestore();
      slices.mockRestore();
    }
  });

  it("rejects content with an invalid checksum", async () => {
    const entry = storedEntry(MANIFEST);
    const file = zipFile(["manifest.json"], "package.zip", {
      "manifest.json": { ...entry, crc32: entry.crc32! ^ 1 },
    });
    await expect(readZipEntryText(file, "manifest.json")).resolves.toBeNull();
  });

  it("returns null for something that is not a ZIP", async () => {
    const file = new File(["zip"], "package.zip", { type: "application/zip" });
    await expect(readZipEntryText(file, "manifest.json")).resolves.toBeNull();
  });
});
