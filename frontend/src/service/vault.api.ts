import api from "@/lib/axios";

export const updateVault = async (data: { encryptedData: string; iv: string }) => {
  return await api.patch("/vault/update", data, { withCredentials: true });
}