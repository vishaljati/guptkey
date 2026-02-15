import {  base64ToBuffer } from "./utils";
export const decryptVault = async (
  encryptedData: string,
  ivBase64: string,
  keyBuffer: ArrayBuffer
) => {
  const key = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const encryptedBuffer = base64ToBuffer(encryptedData);
  const ivBuffer = base64ToBuffer(ivBase64);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(ivBuffer) },
    key,
    encryptedBuffer
  );

  const decoded = new TextDecoder().decode(decrypted);

  return JSON.parse(decoded);
};
