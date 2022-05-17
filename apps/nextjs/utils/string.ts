/**
 * Return UUID. Works on server and client contents.
 */
export const randomUUID = async (): Promise<string> => {
  if (typeof window.crypto.randomUUID === "undefined") {
    const { default: Crypto } = await import("crypto");
    return Crypto.randomUUID();
  } else {
    return window.crypto.randomUUID();
  }
};
