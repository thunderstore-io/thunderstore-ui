// TODO: As this is JS and not TS, the postMessages have to be checked to make sure they return something sane

// Handle messages from the main thread
self.onmessage = async (event) => {
  const { type, part } = event.data;

  if (type === "upload") {
    const { url, payload, uniqueId, checksum } = part;

    try {
      const xhr = new XMLHttpRequest();

      // Set up progress tracking
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          self.postMessage({
            type: "progress",
            uniqueId,
            progress: event.loaded / event.total,
          });
        }
      };

      // Set up completion handler
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          self.postMessage({
            type: "complete",
            uniqueId,
            etag: xhr.getResponseHeader("ETag"),
            response: xhr.response,
          });
        } else {
          self.postMessage({
            type: "error",
            uniqueId,
            error: `HTTP error: ${xhr.status}`,
          });
        }
      };

      // Set up error handler
      xhr.onerror = () => {
        self.postMessage({
          type: "error",
          uniqueId,
          error: "Network error",
        });
      };

      // Open and send the request
      xhr.open("PUT", url);
      if (checksum) {
        xhr.setRequestHeader("Content-MD5", checksum);
      }
      xhr.send(payload);
    } catch (error) {
      self.postMessage({
        type: "error",
        uniqueId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
};
