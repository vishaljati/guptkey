import api from "@/lib/axios";

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}
export interface LoginPayload {
  email: string;
  password: string;
}

// export interface AuthResponse {
//   accessToken: string;
//   user: {
//     _id: string;
//     email: string;
//   };
// }

export const SignupUser = async (
  payload: SignupPayload 
)=> {
  const { data } = await api.post("/auth/signup", payload);
  return data;
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
};
