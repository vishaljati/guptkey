import { encryptVault } from "@/crypto/encrypt";
import { saveVaultApi } from "@/service/vault.api";
import { Vault } from "@/types/vault.types";

export const saveVaultGlobally = async (
  vault: Vault,
  isDirty: boolean,
  key: ArrayBuffer
) => {
  if (!vault) {
    throw new Error("Vault not found");
  }

  if (!key) {
    throw new Error("Encryption key not found");
  }

  if (!isDirty) {
    console.log("No changes detected. Skipping save.");
    return;
  }

  // Encrypt full vault
  const { encryptedData, iv } = await encryptVault(
    vault,
    key
  );

  if (!encryptedData || !iv) {
    throw new Error("Encryption failed");
  }

  // Send to backend
  await saveVaultApi({
    encryptedData,
    iv,
  });

  return true;
};