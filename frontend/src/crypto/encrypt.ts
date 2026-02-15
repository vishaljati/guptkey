import { bufferToBase64 , base64ToBuffer } from "./utils";

export const encryptVault = async (
  data: object,
  keyBuffer: ArrayBuffer
) => {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV

  const key = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const encoded = new TextEncoder().encode(JSON.stringify(data));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  return {
    encryptedData: bufferToBase64(encrypted),
    iv: bufferToBase64(iv.buffer),
  };
};
