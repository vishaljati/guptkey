export const encryptVault = async (
  data: object,
  keyBuffer: ArrayBuffer
) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));

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
    encryptedData: btoa(
      String.fromCharCode(...new Uint8Array(encrypted))
    ),
    iv: btoa(String.fromCharCode(...iv)),
  };
};
