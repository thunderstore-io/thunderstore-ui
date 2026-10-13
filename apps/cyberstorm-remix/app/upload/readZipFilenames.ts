import {
  BlobReader,
  TextWriter,
  WARNING_TRAILING_CENTRAL_DIRECTORY_DATA,
  ZipReader,
} from "@zip.js/zip.js/lib/zip-core-native.js";

const MAX_READ_SIZE = 64 * 1024 * 1024;
const MAX_ENTRIES = 200_000;
const MAX_ENTRY_SIZE = 1024 * 1024;

// Uploads can be gigabytes, so cap the metadata reads.
class MetadataReader extends BlobReader {
  private bytesRead = 0;

  override async readUint8Array(offset: number, length: number) {
    this.bytesRead += length;
    if (
      !Number.isSafeInteger(length) ||
      length < 0 ||
      this.bytesRead > MAX_READ_SIZE
    ) {
      throw new Error("ZIP inspection exceeds the read limit");
    }
    return super.readUint8Array(offset, length);
  }
}

/** Null if the zip can't be read. The server validates it anyway. */
export async function readZipFilenames(file: File): Promise<string[] | null> {
  const reader = new ZipReader(new MetadataReader(file));
  try {
    const names: string[] = [];
    for await (const entry of reader.getEntriesGenerator()) {
      if (names.length === MAX_ENTRIES) return null;
      names.push(entry.filename);
    }
    // zip.js stops at the declared entry count and only warns about the rest.
    // A partial list would report files as missing that the server finds.
    const truncated = reader.warnings?.some(
      (warning) => warning.reason === WARNING_TRAILING_CENTRAL_DIRECTORY_DATA
    );
    return truncated ? null : names;
  } catch {
    return null;
  } finally {
    await reader.close();
  }
}

/**
 * For small metadata files only. Checking the declared size is enough, zip.js
 * errors if the data turns out bigger.
 */
export async function readZipEntryText(
  file: File,
  entryName: string
): Promise<string | null> {
  const reader = new ZipReader(new MetadataReader(file), {
    useWebWorkers: false,
  });
  try {
    let count = 0;
    for await (const entry of reader.getEntriesGenerator()) {
      if (++count > MAX_ENTRIES) return null;
      if (entry.filename !== entryName) continue;
      if (
        entry.directory ||
        entry.encrypted ||
        entry.compressedSize > MAX_ENTRY_SIZE ||
        entry.uncompressedSize > MAX_ENTRY_SIZE
      ) {
        return null;
      }

      return await entry.getData(new TextWriter(), { checkCrc32: true });
    }
    return null;
  } catch {
    return null;
  } finally {
    await reader.close();
  }
}
