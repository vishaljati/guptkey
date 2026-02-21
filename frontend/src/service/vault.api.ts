import api from "@/lib/axios";

export const updateVault = async (data: { encryptedData: string; iv: string }) => {
  return await api.put("/vault/update", data, { withCredentials: true });
}