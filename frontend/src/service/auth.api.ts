import api from "@/lib/axios";

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  encryptedData: string;
  iv: string;
  salt: string;
}
export interface LoginPayload {
  email: string;
  password: string;
}



export const SignupUser = async (
  payload: SignupPayload 
)=> {
  const res = await api.post("/auth/signup", payload);
  return res;
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
};
