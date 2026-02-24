import api from "@/lib/axios";

export const requestPasswordResetApi = async (oldPassword: string) => {
  const res = await api.post(
    "/users/password/reset-request",
    { oldPassword },
    { withCredentials: true }
  );
  return res.data;
};
export const changePasswordWithOtpApi = async (payload: {
  otp: string;
  newPassword: string;
  encryptedData: string;
  iv: string;
  salt: string;
}) => {
  const res = await api.patch(
    "/users/password/reset",
    payload,
    { withCredentials: true }
  );
  return res.data;
};
export const deleteAccountApi = async () => {
  const res = await api.delete(
    "/users/delete",
    { withCredentials: true }
  );
  return res;
};
export const getUserProfileApi = async () => {
  const res = await api.get(
    "/users/profile",
    { withCredentials: true }
  );
  return res;
}
export const requestOtpForDeleteAccountApi = async () => {
  const res = await api.post(
    "/users/delete/request",
    {},
    { withCredentials: true }
  );
  return res;
}
export const confirmDeleteAccountApi = async (otp: string) => {
  const res = await api.post(
    "/users/delete/confirm",
    { otp },
    { withCredentials: true }
  );
  return res;
}
export const cancelAccountDeletionApi = async () => {
  const res = await api.post(
    "/users/delete/cancel", 
    {},
    { withCredentials: true }
  );
  return res;
}