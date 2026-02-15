declare module "argon2-browser/dist/argon2-bundled.min.js" {
  const argon2: {
    ArgonType: {
      Argon2d: number;
      Argon2i: number;
      Argon2id: number;
    };
    hash(params: {
      pass: string | Uint8Array;
      salt: string | Uint8Array;
      type?: number;
      hashLen?: number;
      time?: number;
      mem?: number;
      parallelism?: number;
    }): Promise<{
      hash: Uint8Array;
      hashHex: string;
      encoded: string;
    }>;
  };

  export default argon2;
}
