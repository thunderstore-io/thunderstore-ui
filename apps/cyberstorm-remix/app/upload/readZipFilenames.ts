/**
 * Reads the list of entry filenames from a ZIP file by parsing its central
 * directory, without decompressing any contents.
 *
 * The pre-upload package validation (see {@link ./uploadZipValidation}) only
 * needs the entry names — never the file data — so this deliberately avoids a
 * full ZIP library. It reads just the tail of the file (the End Of Central
 * Directory record and the central directory itself) via `Blob.slice`, so it
 * stays cheap even for the 10GB maximum upload size.
 *
 * Returns `null` when the archive can't be parsed (corrupt, unsupported, or
 * not actually a ZIP). Callers should treat `null` as "couldn't analyse" and
 * fall back to server-side validation rather than blocking the upload.
 */

const EOCD_SIGNATURE = 0x06054b50;
const EOCD_MIN_SIZE = 22;
const ZIP64_EOCD_LOCATOR_SIGNATURE = 0x07064b50;
const ZIP64_EOCD_LOCATOR_SIZE = 20;
const ZIP64_EOCD_SIGNATURE = 0x06064b50;
const ZIP64_EOCD_SIZE = 56;
const CENTRAL_DIRECTORY_HEADER_SIGNATURE = 0x02014b50;
const CENTRAL_DIRECTORY_HEADER_MIN_SIZE = 46;

/** Max ZIP comment length is 0xffff; the EOCD lives within this of the end. */
const MAX_EOCD_SEARCH = EOCD_MIN_SIZE + 0xffff;
/** Guard against pathological archives: cap the central directory we read. */
const MAX_CENTRAL_DIRECTORY_SIZE = 64 * 1024 * 1024;
/** Guard against runaway loops on malformed central directories. */
const MAX_ENTRIES = 200_000;

async function sliceToDataView(
  file: File,
  start: number,
  end?: number
): Promise<DataView> {
  const buffer = await file.slice(start, end).arrayBuffer();
  return new DataView(buffer);
}

/** Reads an unsigned 64-bit little-endian int, or null if it exceeds 2^53-1. */
function readSafeUint64(view: DataView, offset: number): number | null {
  const low = view.getUint32(offset, true);
  const high = view.getUint32(offset + 4, true);
  const value = high * 0x1_0000_0000 + low;
  return Number.isSafeInteger(value) ? value : null;
}

interface CentralDirectoryLocation {
  offset: number;
  size: number;
}

function locateCentralDirectory(
  eocd: DataView,
  eocdOffset: number
): CentralDirectoryLocation | "needs-zip64" | null {
  const size = eocd.getUint32(eocdOffset + 12, true);
  const offset = eocd.getUint32(eocdOffset + 16, true);

  // Only a maxed-out directory size/offset forces ZIP64. The record counts
  // (offsets +8/+10) legitimately read 0xffff for exactly 65535 entries, and
  // we never rely on them (the directory is walked by signature), so a 0xffff
  // count must NOT trigger the ZIP64 path — doing so made a valid 65535-entry
  // archive unreadable.
  if (size === 0xffffffff || offset === 0xffffffff) {
    return "needs-zip64";
  }

  return { offset, size };
}

async function locateZip64CentralDirectory(
  file: File,
  eocdAbsoluteOffset: number
): Promise<CentralDirectoryLocation | null> {
  const locatorOffset = eocdAbsoluteOffset - ZIP64_EOCD_LOCATOR_SIZE;
  if (locatorOffset < 0) return null;

  const locator = await sliceToDataView(
    file,
    locatorOffset,
    locatorOffset + ZIP64_EOCD_LOCATOR_SIZE
  );
  if (locator.getUint32(0, true) !== ZIP64_EOCD_LOCATOR_SIGNATURE) return null;

  const zip64EocdOffset = readSafeUint64(locator, 8);
  if (
    zip64EocdOffset === null ||
    zip64EocdOffset + ZIP64_EOCD_SIZE > file.size
  ) {
    return null;
  }

  const zip64Eocd = await sliceToDataView(
    file,
    zip64EocdOffset,
    zip64EocdOffset + ZIP64_EOCD_SIZE
  );
  if (zip64Eocd.getUint32(0, true) !== ZIP64_EOCD_SIGNATURE) return null;

  const size = readSafeUint64(zip64Eocd, 40);
  const offset = readSafeUint64(zip64Eocd, 48);
  if (size === null || offset === null) return null;

  return { offset, size };
}

function findEocdOffset(eocd: DataView): number | null {
  // Scan backwards: the EOCD is the last record, optionally followed only by
  // its own variable-length comment.
  for (let i = eocd.byteLength - EOCD_MIN_SIZE; i >= 0; i--) {
    if (eocd.getUint32(i, true) !== EOCD_SIGNATURE) continue;
    const commentLength = eocd.getUint16(i + 20, true);
    // Accept the record as long as its declared comment fits within the slice.
    // Requiring it to end exactly at EOF rejected otherwise-valid archives that
    // carry trailing bytes after the EOCD (e.g. appended signatures/metadata).
    if (i + EOCD_MIN_SIZE + commentLength <= eocd.byteLength) {
      return i;
    }
  }
  return null;
}

function parseCentralDirectoryNames(
  centralDirectory: DataView
): string[] | null {
  const decoder = new TextDecoder("utf-8");
  const names: string[] = [];
  let cursor = 0;

  while (
    cursor + CENTRAL_DIRECTORY_HEADER_MIN_SIZE <=
    centralDirectory.byteLength
  ) {
    if (
      centralDirectory.getUint32(cursor, true) !==
      CENTRAL_DIRECTORY_HEADER_SIGNATURE
    ) {
      // The central directory is contiguous fixed-signature records; a record
      // that doesn't start with the signature means it's truncated or corrupt.
      // Return null (defer to the server) rather than a partial, misleading
      // list that would raise false "missing manifest/icon/README" errors.
      return null;
    }

    const nameLength = centralDirectory.getUint16(cursor + 28, true);
    const extraLength = centralDirectory.getUint16(cursor + 30, true);
    const commentLength = centralDirectory.getUint16(cursor + 32, true);
    const nameStart = cursor + CENTRAL_DIRECTORY_HEADER_MIN_SIZE;
    const nameEnd = nameStart + nameLength;
    if (nameEnd > centralDirectory.byteLength) return null;
    // The record also declares extra and comment fields after the name. A final
    // record whose declared length runs past the directory is truncated, so
    // defer to the server rather than returning a partial, misleading list.
    const nextCursor = nameEnd + extraLength + commentLength;
    if (nextCursor > centralDirectory.byteLength) return null;

    const nameBytes = new Uint8Array(
      centralDirectory.buffer,
      centralDirectory.byteOffset + nameStart,
      nameLength
    );
    names.push(decoder.decode(nameBytes));

    cursor = nextCursor;
    // An archive with more entries than we're willing to scan: defer to the
    // server instead of validating against a truncated list.
    if (names.length > MAX_ENTRIES) return null;
  }

  // A non-empty central directory that yields no parseable headers is corrupt.
  return names.length > 0 ? names : null;
}

export async function readZipFilenames(file: File): Promise<string[] | null> {
  try {
    const fileSize = file.size;
    if (fileSize < EOCD_MIN_SIZE) return null;

    const searchSize = Math.min(fileSize, MAX_EOCD_SEARCH);
    const searchStart = fileSize - searchSize;
    const eocd = await sliceToDataView(file, searchStart);

    const eocdOffset = findEocdOffset(eocd);
    if (eocdOffset === null) return null;
    const eocdAbsoluteOffset = searchStart + eocdOffset;

    let location = locateCentralDirectory(eocd, eocdOffset);
    if (location === "needs-zip64") {
      location = await locateZip64CentralDirectory(file, eocdAbsoluteOffset);
    }
    if (location === null) return null;

    const { offset, size } = location;
    // An empty but well-formed archive has a zero-length central directory.
    if (size === 0) return [];
    if (size < 0 || size > MAX_CENTRAL_DIRECTORY_SIZE) return null;
    if (offset < 0 || offset + size > fileSize) return null;

    const centralDirectory = await sliceToDataView(file, offset, offset + size);
    return parseCentralDirectoryNames(centralDirectory);
  } catch {
    return null;
  }
}
