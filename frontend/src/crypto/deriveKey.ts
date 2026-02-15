import argon2 from "argon2-browser/dist/argon2-bundled.min.js";

export const deriveKey = async (
  password: string,
  salt: Uint8Array
): Promise<ArrayBuffer> => {
  const result = await argon2.hash({
    pass: password,
    salt,
    type: argon2.ArgonType.Argon2id,
    hashLen: 32,
    time: 3,
    mem: 65536,
    parallelism: 1,
  });

  return new Uint8Array(result.hash).buffer;
};
