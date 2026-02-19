import api from "@/lib/axios";
import { LoginPayload, SignupPayload } from "@/types/auth.types";

export const SignupUser = async (
  payload: SignupPayload 
)=> {
  return await api.post("/auth/signup", payload,{ withCredentials: true });
  
};

export const LoginUser = async (payload: LoginPayload) => {
  return await api.post("/auth/login", payload,{ withCredentials: true });

};

export const LogoutUser = async () => {
  return await api.post("/auth/logout", {}, { withCredentials: true });
};
