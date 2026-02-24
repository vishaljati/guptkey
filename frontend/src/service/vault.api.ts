import api from "@/lib/axios";

export const saveVaultApi = async (payload: {
  encryptedData: string;
  iv: string;
  salt: string;
}) => {
  const res = await api.patch("/vault/update", payload, {
    withCredentials: true,
  });

  return res;
};

export const getEncryptedVaultApi = async () => {
  const res = await api.get("/vault/get", {
    withCredentials: true,
  });
  return res;
};