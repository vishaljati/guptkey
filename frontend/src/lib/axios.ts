import axios from "axios";
import { ENV } from "@/config/env-config";
import { AxiosError , InternalAxiosRequestConfig} from "axios";


// Create an Axios instance with default settings
const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

//Attachintg token to every request if exists
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(true);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const requestURL = originalRequest.url || "";

    const isAuthRoute =
      requestURL.includes("/auth/login") ||
      requestURL.includes("/auth/register") ||
      requestURL.includes("/auth/refresh");

    // --------------------------------
    // 🔐 Handle Access Token Expiry
    // --------------------------------
    if (
      status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;

      try {
        // Attempt refresh (cookies automatically sent)
        await api.post(
          `/auth/refresh`,
          {},
          { withCredentials: true }
        );

        processQueue();
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        // Refresh failed → force logout
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // --------------------------------
    // 🚫 Login/Register Failure
    // --------------------------------
    if (status === 401 && isAuthRoute) {
      return Promise.reject(error);
    }

    // --------------------------------
    // 🔒 Refresh Token Expired
    // --------------------------------
    if (status === 403) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
