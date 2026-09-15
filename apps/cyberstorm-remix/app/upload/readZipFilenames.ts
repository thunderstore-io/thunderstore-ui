import { BlobReader, ZipReader } from "@zip.js/zip.js/index-native.js";

const MAX_READ_SIZE = 64 * 1024 * 1024;
const MAX_ENTRIES = 200_000;
const MAX_ENTRY_SIZE = 1024 * 1024;

// Inspect metadata without buffering multi-gigabyte uploads or unbounded directories.
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

/** Returns null when inspection fails so server-side validation can take over. */
export async function readZipFilenames(file: File): Promise<string[] | null> {
  const reader = new ZipReader(new MetadataReader(file));
  try {
    const names: string[] = [];
    for await (const entry of reader.getEntriesGenerator()) {
      if (names.length === MAX_ENTRIES) return null;
      names.push(entry.filename);
    }
    return names;
  } catch {
    return null;
  } finally {
    await reader.close();
  }
}

/** Extracts only small metadata files, with a limit on actual decoded bytes. */
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

      const decoder = new TextDecoder();
      let size = 0;
      let text = "";
      await entry.getData(
        new WritableStream<Uint8Array>({
          write(chunk) {
            size += chunk.byteLength;
            if (size > MAX_ENTRY_SIZE) {
              throw new Error("ZIP entry exceeds the size limit");
            }
            text += decoder.decode(chunk, { stream: true });
          },
        }),
        { checkSignature: true }
      );
      if (size !== entry.uncompressedSize) return null;
      return text + decoder.decode();
    }
    return null;
  } catch {
    return null;
  } finally {
    await reader.close();
  }
}
