export const generateSalt = (): Uint8Array => {
  return crypto.getRandomValues(new Uint8Array(16));
};

export function bufferToBase64(buffer: ArrayBuffer | SharedArrayBuffer): string {
  const view = new Uint8Array(buffer);
  return btoa(String.fromCharCode.apply(null, Array.from(view)));
}
export const base64ToBuffer = (base64: string) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};
