import crypto from "crypto-js";

export function calculateMD5(blob: Blob): Promise<string> {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const md5 = crypto.MD5(
        crypto.enc.Latin1.parse(reader.result!.toString())
      );
      resolve(md5.toString(crypto.enc.Base64));
    };
    reader.readAsBinaryString(blob);
  });
}
