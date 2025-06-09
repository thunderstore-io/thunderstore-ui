export function slicePart(file: File, offset: number, length: number): Blob {
  const start = offset;
  const end = offset + length;
  return end < file.size ? file.slice(start, end) : file.slice(start);
}
