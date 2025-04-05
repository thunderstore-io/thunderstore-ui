if (window.Worker) {
  // Handle messages from the main thread
  self.onmessage = async (event) => {
    const { type, part } = event.data;

    if (type === "upload") {
      try {
        const { url, payload, partNumber } = part;

        // Create a new XMLHttpRequest for the upload
        const xhr = new XMLHttpRequest();

        // Set up progress tracking
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            // Send progress update back to main thread
            self.postMessage({
              type: "progress",
              partNumber,
              progress: {
                loaded: e.loaded,
                total: e.total,
              },
            });
          }
        };

        // Create a promise to handle the XHR lifecycle
        const uploadPromise = new Promise((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const etag = xhr.getResponseHeader("etag");
              if (etag) {
                resolve(etag);
              } else {
                reject(new Error("ETag header was missing from the response"));
              }
            } else {
              reject(new Error(`Upload failed with status: ${xhr.status}`));
            }
          };

          xhr.onerror = () => {
            reject(new Error("Network error during upload"));
          };

          xhr.onabort = () => {
            reject(new Error("Upload aborted"));
          };
        });

        // Start the upload
        xhr.open("PUT", url);
        xhr.send(payload);

        // Wait for the upload to complete
        const etag = await uploadPromise;

        // Send success response back to main thread
        self.postMessage({
          type: "complete",
          partNumber,
          etag,
        });
      } catch (error) {
        // Send error response back to main thread
        self.postMessage({
          type: "error",
          partNumber: part.partNumber,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  };
}
