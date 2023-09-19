export async function apiFetch(path: string) {
  const response = await fetch(path);
  return await response.json();
}
