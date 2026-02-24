export interface ImportMetaEnv {
  readonly API_BASE_URL: string;
}

export const ENV:ImportMetaEnv = {

  API_BASE_URL: String(import.meta.env.VITE_API_BASE_URL || "https://guptkey.onrender.com/api/v1"),

}
