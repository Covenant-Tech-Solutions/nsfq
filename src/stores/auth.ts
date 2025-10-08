/** @format */

import { publicInstance } from "@/configs/axiosConfig";
/** @format */

import { ONBOARDING_POSITION, TOKEN_NAME } from "@/configs";
import {
  privateInstance,
  updatePrivateAxiosInstance,
} from "@/configs/axiosConfig";
import { UserType } from "@/types/user";
import Cookies from "js-cookie";
import { createStore } from "zustand/vanilla";

export type AuthState = {
  isAuthenticated: boolean;
  token: string;
  user: any;
  appInfo: any;
};

export type AuthActions = {
  login: (token: string, user: any) => void;
  logout: () => void;
  getUser: () => Promise<UserType | undefined>;
  loginWithToken: (token: string) => void;
};

export type AuthStore = AuthState & AuthActions;

export const defaultInitState: AuthState = {
  isAuthenticated: false,
  token: "",
  user: undefined,
  appInfo: null,
};

export const createAuthStore = (initState: AuthState = defaultInitState) => {
  return createStore<AuthStore>((set) => ({
    ...initState,
    /**
     * Authenticates a user by setting the authentication state to true and storing the user's token and data.
     *
     * @param {string} token - The authentication token for the user.
     * @param {any} user - The user's data.
     * @return {void} No return value.
     */
    loginWithToken: async (token) => {
      if (!token) {
        return;
      }
      try {
        const response = await publicInstance.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.data;
        const user: UserType = data?.data;
        if (!user) {
          return;
        }
        Cookies.set(TOKEN_NAME, token);
        set({
          isAuthenticated: true,
          token,
          user,
        });
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * Authenticates a user by setting the authentication state to true and storing the user's token and data.
     *
     * @param {string} token - The authentication token for the user.
     * @param {any} user - The user's data.
     * @return {void} No return value.
     */
    login: (token, user) => {
      updatePrivateAxiosInstance(token);
      Cookies.set(TOKEN_NAME, token);
      set({
        isAuthenticated: true,
        token,
        user,
      });
    },
    /**
     * Logs the user out of the application.
     *
     * Makes a POST request to the /auth/logout endpoint to invalidate the user's session.
     * If the request is successful, removes the authentication token from the cookie and updates the authentication state.
     *
     * @return {Promise<void>} A promise that resolves when the logout operation is complete.
     */
    logout: async () => {
      try {
        const response = await privateInstance.post("/auth/logout");

        if (response.status === 200) {
          Cookies.remove(TOKEN_NAME);
          localStorage.removeItem(ONBOARDING_POSITION);
          updatePrivateAxiosInstance("");
          set({
            isAuthenticated: false,
            token: "",
            user: null,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * Retrieves the authenticated user's data from the server.
     *
     * Makes a GET request to the /auth/user endpoint to fetch the user's data.
     * If the request is successful, updates the authentication state with the received user data.
     *
     * @return {Promise<void>} A promise that resolves when the user data is fetched and the authentication state is updated.
     */
    getUser: async () => {
      try {
        const response = await privateInstance.get("/auth/me");
        const data = await response.data;
        const user: UserType = data?.data;
        set({ user, isAuthenticated: true });
        return user;
      } catch (error) {
        set({ user: null, isAuthenticated: false });
        console.log(error);
      }
    },
  }));
};
