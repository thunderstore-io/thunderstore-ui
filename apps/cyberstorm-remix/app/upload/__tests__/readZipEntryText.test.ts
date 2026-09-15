import {
  BlobWriter,
  TextReader,
  ZipWriter,
  configure,
} from "@zip.js/zip.js/index-native.js";
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

  it("accepts a deflated entry exactly at the size cap", async () => {
    const text = "x".repeat(1024 * 1024);
    const file = zipFile(["manifest.json"], "package.zip", {
      "manifest.json": await deflatedEntry(text),
    });
    await expect(readZipEntryText(file, "manifest.json")).resolves.toBe(text);
  });

  it("stops reading decompressed output when the declared size is smaller", async () => {
    const chunk = new Uint8Array(64 * 1024);
    let chunksRead = 0;
    let cancelled = false;
    vi.stubGlobal(
      "DecompressionStream",
      class {
        readable = new ReadableStream<Uint8Array>(
          {
            pull(controller) {
              controller.enqueue(chunk);
              if (++chunksRead === 32) controller.close();
            },
            cancel() {
              cancelled = true;
            },
          },
          { highWaterMark: 0 }
        );
        writable = new WritableStream();
      }
    );
    configure({ DecompressionStream: globalThis.DecompressionStream });
    try {
      const file = zipFile(["manifest.json"], "package.zip", {
        "manifest.json": {
          ...storedEntry("compressed"),
          method: 8,
          uncompressedSize: 1,
        },
      });
      await expect(readZipEntryText(file, "manifest.json")).resolves.toBeNull();
      expect(cancelled).toBe(true);
      expect(chunksRead).toBeLessThan(32);
    } finally {
      vi.unstubAllGlobals();
      configure({ DecompressionStream: globalThis.DecompressionStream });
    }
  });

  it.each(["stored", "deflated"])(
    "rejects a %s entry with a mismatched size",
    async (method) => {
      const entry =
        method === "stored"
          ? storedEntry(MANIFEST)
          : await deflatedEntry(MANIFEST);
      const file = zipFile(["manifest.json"], "package.zip", {
        "manifest.json": {
          ...entry,
          uncompressedSize: entry.uncompressedSize + 1,
        },
      });
      await expect(readZipEntryText(file, "manifest.json")).resolves.toBeNull();
    }
  );

  it("reads metadata from a ZIP64 archive", async () => {
    const writer = new ZipWriter(new BlobWriter(), {
      zip64: true,
      useWebWorkers: false,
    });
    await writer.add("manifest.json", new TextReader(MANIFEST), {
      zip64: true,
    });
    const file = new File([await writer.close()], "package.zip");
    await expect(readZipFilenames(file)).resolves.toEqual(["manifest.json"]);
    await expect(readZipEntryText(file, "manifest.json")).resolves.toBe(
      MANIFEST
    );
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
