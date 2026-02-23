import api from "@/lib/axios";

export const requestPasswordResetApi = async (oldPassword: string) => {
  const res= await api.post(
    "/users/password/reset-request",
    { oldPassword },
    { withCredentials: true }
  );
  return res.data;
};

export const changePasswordWithOtpApi = async (otp: string, newPassword: string) => {
  const res = await api.patch(
    "/users/password/reset",
    { otp , newPassword },
    { withCredentials: true }
  );
  return res.data;
};  
