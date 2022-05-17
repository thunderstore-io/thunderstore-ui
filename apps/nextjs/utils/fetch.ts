/** Return config for using fetch() to POST JSON data */
export const getJsonPostSettings = (
  payload: Record<string, unknown>
): RequestInit => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
