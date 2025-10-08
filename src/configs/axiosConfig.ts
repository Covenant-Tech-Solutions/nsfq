import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL, MAINTENANCE } from ".";

export const publicInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  withXSRFToken: true,
});

export const privateInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
  },
});
privateInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get(process.env.NEXT_PUBLIC_TOKEN_NAME ?? "token");
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
privateInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      Cookies.remove(process.env.NEXT_PUBLIC_TOKEN_NAME ?? "token");
      const pathname = window.location.pathname;
      if (
        pathname.startsWith("/profile") ||
        pathname.startsWith("/create-profile")
      ) {
        window.location.href = "/sign-in";
      }
    }

    if (error?.response?.status === 503) {
      Cookies.remove(process.env.NEXT_PUBLIC_TOKEN_NAME ?? "token");
      Cookies.set(MAINTENANCE, "true");
      window.location.href = "/maintenance";
    } else if (
      [400, 500, 403, 404, 200, 201].includes(error?.response?.status) &&
      Cookies.get(MAINTENANCE)
    ) {
      Cookies.remove(MAINTENANCE);
    }

    return Promise.reject(error);
  },
);

export const updatePrivateAxiosInstance = (token: string) => {
  privateInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
