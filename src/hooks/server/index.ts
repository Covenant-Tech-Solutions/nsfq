/** @format */

import { getFetchInstance } from "@/configs/getFetchInstance";
import { AppInfoType } from "@/types";

export const getAppInfo = async () => {
  try {
    const response = (await getFetchInstance({
      url: "/info",
      cache: true,
    })) as any;
    return response?.data as AppInfoType;
  } catch (error: any) {
    console.warn(error);
  }
};

export const getAppRobots = async () => {
  try {
    const response = (await getFetchInstance({
      url: "/app-robots",
      cache: true,
    })) as any;
    return response?.data;
  } catch (error: any) {
    console.warn(error);
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
        },
      ],
    };
  }
};

export const getAppSitemap = async () => {
  try {
    const response = (await getFetchInstance({
      url: "/app-sitemap",
      cache: true,
    })) as any;

    return response?.data;
  } catch (error: any) {
    console.warn(error);
    return [];
  }
};

export const getPages = async () => {
  try {
    const response = (await getFetchInstance({
      url: "/pages",
      cache: true,
    })) as any;
    return response?.data;
  } catch (error: any) {
    console.warn(error);
  }
};

export const getMenus = async () => {
  try {
    const response = (await getFetchInstance({
      url: "/menus",
      cache: true,
    })) as any;
    return response?.data;
  } catch (error: any) {
    console.warn(error);
  }
};
