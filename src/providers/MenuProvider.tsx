"use client";
import { MenuGroup } from "@/types/menu";
import React, { createContext, useContext, useMemo } from "react";

// Define context shape
interface MenuContextType {
  menus: MenuGroup[];
}

// Create the context
const MenuContext = createContext<MenuContextType>({
  menus: [],
});

interface MenuProviderTypes {
  children: React.ReactNode;
  menuData: MenuGroup[]; // <-- Only the data (not MenuResponse)
}

// Provider component
export const MenuProvider = ({ children, menuData }: MenuProviderTypes) => {
  const value = useMemo(() => ({ menus: menuData }), [menuData]);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

// Hook to use menu data
export const useMenu = () => {
  return useContext(MenuContext);
};
