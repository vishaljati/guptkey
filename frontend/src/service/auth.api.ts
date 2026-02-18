import api from "@/lib/axios";
import { LoginPayload, SignupPayload } from "@/types/auth.types";

export const SignupUser = async (
  payload: SignupPayload 
)=> {
  const res = await api.post("/auth/signup", payload,{ withCredentials: true });
  return res;
};

export const LoginUser = async (payload: LoginPayload) => {
  const res = await api.post("/auth/login", payload,{ withCredentials: true });
  console.log(res);
  
  return res;
};

export const logoutUser = async () => {
  await api.post("/auth/logout", {}, { withCredentials: true });
};
