import { type Vault } from "@/types/vault.types";

export const createEmptyVault = (): Vault => {
  const now = Date.now();

  return {
    version: 1,
    createdAt: now,
    updatedAt: now,
    entries: [],
  };
};
