import { encryptVault } from "@/crypto/encrypt";
import { updateVault } from "@/service/vault.api";

export const syncVault = async (
  vault: any,
  key: ArrayBuffer
) => {
  const { encryptedData, iv } = await encryptVault(vault, key);

  await updateVault({
    encryptedData,
    iv,
  });

  return { encryptedData, iv };
};