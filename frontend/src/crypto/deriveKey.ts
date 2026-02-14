import argon2 from "argon2-browser";

//This converts:
//---Master password → secure 256-bit key

export const deriveKey = async (
  password: string,
  salt: Uint8Array
): Promise<ArrayBuffer> => {
  const result = await argon2.hash({
    pass: password,
    salt,
    type: argon2.ArgonType.Argon2id,
    hashLen: 32, // 256-bit key
    time: 3,
    mem: 65536,
    parallelism: 1,
  });

  return result.hash.slice(0);

};
