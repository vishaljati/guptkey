export interface ImportMetaEnv {
  readonly API_BASE_URL: string;
}

export const ENV:ImportMetaEnv = {

  API_BASE_URL: String(import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1"),

}
