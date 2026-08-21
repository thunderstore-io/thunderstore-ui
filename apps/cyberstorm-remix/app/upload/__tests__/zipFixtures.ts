/**
 * Builds minimal ZIP archives for tests: local headers, central directory and
 * EOCD only, which is all the upload form's reader parses. Entries are stored
 * (uncompressed) and empty unless `contents` provides data for them.
 */

export interface ZipEntryContent {
  /** Compression method as written to the headers: 0 stored, 8 deflate. */
  method: number;
  /** Bytes written after the local header, already compressed for method 8. */
  data: Uint8Array;
  uncompressedSize: number;
  /** Overrides the compressed size written to the headers. */
  compressedSize?: number;
}

export function buildZip(
  filenames: string[],
  contents: Record<string, ZipEntryContent> = {}
): Uint8Array<ArrayBuffer> {
  const encoder = new TextEncoder();
  const localChunks: Uint8Array[] = [];
  const centralChunks: Uint8Array[] = [];
  const localOffsets: number[] = [];
  let offset = 0;

  for (const name of filenames) {
    const nameBytes = encoder.encode(name);
    const content = contents[name];
    localOffsets.push(offset);

    const local = new Uint8Array(
      30 + nameBytes.length + (content?.data.length ?? 0)
    );
    const view = new DataView(local.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 0x0800, true);
    view.setUint16(8, content?.method ?? 0, true);
    view.setUint32(
      18,
      content?.compressedSize ?? content?.data.length ?? 0,
      true
    );
    view.setUint32(22, content?.uncompressedSize ?? 0, true);
    view.setUint16(26, nameBytes.length, true);
    local.set(nameBytes, 30);
    if (content) local.set(content.data, 30 + nameBytes.length);

    localChunks.push(local);
    offset += local.length;
  }

  const centralStart = offset;
  filenames.forEach((name, index) => {
    const nameBytes = encoder.encode(name);
    const content = contents[name];
    const central = new Uint8Array(46 + nameBytes.length);
    const view = new DataView(central.buffer);
    view.setUint32(0, 0x02014b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 20, true);
    view.setUint16(8, 0x0800, true);
    view.setUint16(10, content?.method ?? 0, true);
    view.setUint32(
      20,
      content?.compressedSize ?? content?.data.length ?? 0,
      true
    );
    view.setUint32(24, content?.uncompressedSize ?? 0, true);
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

export function zipFile(
  filenames: string[],
  name = "package.zip",
  contents?: Record<string, ZipEntryContent>
): File {
  return new File([buildZip(filenames, contents)], name, {
    type: "application/zip",
  });
}

export function storedEntry(text: string): ZipEntryContent {
  const data = new TextEncoder().encode(text);
  return { method: 0, data, uncompressedSize: data.length };
}

export async function deflatedEntry(text: string): Promise<ZipEntryContent> {
  const raw = new TextEncoder().encode(text);
  const compressed = await new Response(
    new Blob([raw]).stream().pipeThrough(new CompressionStream("deflate-raw"))
  ).arrayBuffer();
  return {
    method: 8,
    data: new Uint8Array(compressed),
    uncompressedSize: raw.length,
  };
}
