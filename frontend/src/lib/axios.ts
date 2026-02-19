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
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//Handling 401 errors and refreshing token
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


    //HANDLE ACCESS TOKEN EXPIRE
    if (
      status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      // If refresh already running → queue request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;

      try {
        await axios.post(
          `${ENV.API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        processQueue();
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        // 🔥 Refresh failed → logout
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

  

     //LOGIN / REGISTER FAILURE
    if (status === 401 && isAuthRoute) {
      return Promise.reject(error);
    }


     // REFRESH TOKEN EXPIRED

    if (status === 403) {
      window.location.href = "/login";
      return Promise.reject(error);
    }


    //ALL OTHER ERRORS
    return Promise.reject(error);
  }
);
export default api;
