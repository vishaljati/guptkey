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

  const encryptedBytes = Uint8Array.from(
    atob(encryptedData),
    c => c.charCodeAt(0)
  );

  const iv = Uint8Array.from(
    atob(ivBase64),
    c => c.charCodeAt(0)
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedBytes
  );

  const decoded = new TextDecoder().decode(decrypted);

  return JSON.parse(decoded);
};
