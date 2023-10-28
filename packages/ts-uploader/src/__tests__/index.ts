import { initMultipartUpload } from "../state/MultipartUpload";

it("is configured correctly for tests", () => {
  expect(process.env.TS_API_DOMAIN).toBeTruthy();
  expect(process.env.TS_API_AUTHORIZATION).toBeTruthy();
  // See README.md for test configuration instructions!
});

it(
  "uploads a multipart upload",
  async () => {
    const apiConfig = {
      domain: process.env.TS_API_DOMAIN!,
      authorization: process.env.TS_API_AUTHORIZATION!,
    };

    (window as any)._origin = apiConfig.domain;
    // Backend default configuration sets multipart split at 50mb, so we need to
    // go slightly over that to truly test the functionality. It could be worth
    // adjusting the test backend to support smaller size splits.
    const blob = new Blob([new ArrayBuffer(1024 * 1024 * 51)], {
      type: "application/octet-stream",
    });
    const file = new File([blob], "test.bin");
    const upload = await initMultipartUpload(file, {
      api: apiConfig,
    });
    await expect(upload.startUpload()).resolves.not.toThrowError();
  },
  1000 * 30
);
