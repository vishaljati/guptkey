import api from "@/lib/axios";

export const saveVaultApi = async (payload: {
  encryptedData: string;
  iv: string;
}) => {
  const res = await api.patch("/vault/update", payload, {
    withCredentials: true,
  });

  return res;
};