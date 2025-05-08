import cryptojs from "crypto-js";

// Define the calculateMD5 function directly in the worker
async function calculateMD5(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const wordArray = cryptojs.lib.WordArray.create(reader.result);
        const hash = cryptojs.MD5(wordArray);
        resolve(hash.toString(cryptojs.enc.Base64));
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read blob"));
    };

    reader.readAsArrayBuffer(blob);
  });
}

// Handle messages from the main thread
self.onmessage = async (event) => {
  const { type, data, uniqueId } = event.data;

  if (type === "calculate") {
    try {
      // Calculate MD5 hash
      const md5 = await calculateMD5(data);

      // Send success response back to main thread
      self.postMessage({
        type: "complete",
        md5,
        uniqueId,
      });
    } catch (error) {
      // Send error response back to main thread
      self.postMessage({
        type: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        uniqueId,
      });
    }
  }
};
