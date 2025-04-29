import axios, { AxiosError, AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { API_URL } from "./api";
import { toast } from "react-toastify";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {

      const haveToken = Cookies.get("accessToken");
      
      if (haveToken) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("user");
        toast.error("Session expired, please login again.");
        window.location.href = "/login";
      }
    } else if (error.response?.status === 500) {
      toast.error("Server error, please try again later.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
