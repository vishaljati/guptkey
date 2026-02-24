import api from "@/lib/axios";

export const requestPasswordResetApi = async (oldPassword: string) => {
  const res= await api.post(
    "/users/password/reset-request",
    { oldPassword },
    { withCredentials: true }
  );
  return res.data;
};

export const changePasswordWithOtpApi = async (payload:{
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
