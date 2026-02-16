
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