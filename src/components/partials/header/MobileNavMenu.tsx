/** @format */

import { Button } from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { useTranslations } from "@/providers/TranslationProviders";
import { MenuItem } from "@/types/menu";
import { getPageUrl } from "@/utils/helper";
import { CaretDownIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { SetStateAction, useState } from "react";
import { _SIDEBAR_MENU } from "@/constants/Sidebar";
import { useAuthStore } from "@/providers/AuthStoreProviders";

const AnimateHeight = dynamic(() => import("react-animate-height"), {
  ssr: false,
});

// Helper function to check if any child is active
const hasActiveChild = (item: MenuItem, currentPath: string): boolean => {
  if (!item.children || item.children.length === 0) {
    return false;
  }

  return item.children.some((child) => {
    const childUrl = getPageUrl(child);
    if (childUrl === currentPath) {
      return true;
    }
    return hasActiveChild(child, currentPath);
  });
};

// Helper function to check if current item or any descendant is active
const isActiveOrHasActiveChild = (
  item: MenuItem,
  currentPath: string,
): boolean => {
  const itemUrl = getPageUrl(item);
  if (itemUrl === currentPath) {
    return true;
  }
  return hasActiveChild(item, currentPath);
};

// Recursive component to handle nested menu items
const NestedMenuItem = ({
  item,
  level = 0,
  onLinkClick,
  openMenus,
  toggleMenu,
  path,
}: {
  item: MenuItem;
  level?: number;
  onLinkClick: () => void;
  openMenus: Set<string>;
  toggleMenu: (key: string, level: number) => void;
  path: string;
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const paddingLeft = `${(level + 1) * 20}px`;
  const itemKey = `${item.id}-${level}`;
  const isOpen = openMenus.has(itemKey);

  const { tran } = useTranslations();

  // Check if this item or any of its children is active
  const isActive = isActiveOrHasActiveChild(item, path);
  const isDirectlyActive = getPageUrl(item) === path;

  if (hasChildren) {
    return (
      <li className="list-none">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu(itemKey, level);
          }}
          className={`flex w-full cursor-pointer items-center justify-between py-2 text-left font-medium duration-300 ${
            isActive ? "text-primary font-semibold" : "hover:text-primary"
          }`}
          style={{ paddingLeft }}
        >
          <span className={isActive ? "font-semibold" : ""}>
            {tran(item.title)}
          </span>
          <CaretDownIcon
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            } ${isActive ? "text-primary" : ""}`}
            size={16}
          />
        </button>
        <AnimateHeight duration={500} height={isOpen ? "auto" : 0}>
          <ul className="flex flex-col">
            {item.children?.map((subItem) => (
              <NestedMenuItem
                key={`${subItem.id}-${level + 1}`}
                item={subItem}
                level={level + 1}
                onLinkClick={onLinkClick}
                openMenus={openMenus}
                toggleMenu={toggleMenu}
                path={path}
              />
            ))}
          </ul>
        </AnimateHeight>
      </li>
    );
  }

  return (
    <li className="list-none">
      <Link
        href={getPageUrl(item)}
        onClick={(e) => {
          e.stopPropagation();
          onLinkClick();
        }}
        className={`block py-2 duration-300 ${
          isDirectlyActive ? "text-primary font-bold" : "hover:text-primary"
        }`}
        style={{ paddingLeft }}
      >
        <span className="mr-2">-</span>
        <span className={isDirectlyActive ? "font-bold" : ""}>
          {tran(item.title)}
        </span>
      </Link>
    </li>
  );
};

export default function MobileNavMenu({
  menus,
  showMobileMenu,
  setShowMobileMenu,
}: {
  menus: MenuItem[];
  showMobileMenu: boolean;
  setShowMobileMenu: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());
  const path = usePathname();
  const { user } = useAuthStore((state: any) => state);
  const { tran } = useTranslations();

  const toggleMenu = (menuKey: string, level: number) => {
    setOpenMenus((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(menuKey)) {
        // Close this menu and all its children
        Array.from(newSet).forEach((key) => {
          if (
            key === menuKey ||
            key.startsWith(menuKey.split("-")[0] + "-" + (level + 1))
          ) {
            newSet.delete(key);
          }
        });
      } else {
        // Close siblings at the same level
        if (level === 0) {
          // For top-level menus, close all other top-level menus and their children
          newSet.clear();
        } else {
          // For nested menus, close siblings at the same level
          Array.from(newSet).forEach((key) => {
            const keyLevel = parseInt(key.split("-")[1]);
            if (keyLevel === level && key !== menuKey) {
              newSet.delete(key);
              // Also close children of siblings
              Array.from(newSet).forEach((childKey) => {
                if (
                  childKey.startsWith(key.split("-")[0] + "-" + (level + 1))
                ) {
                  newSet.delete(childKey);
                }
              });
            }
          });
        }

        // Open the clicked menu
        newSet.add(menuKey);
      }

      return newSet;
    });
  };

  const handleLinkClick = () => {
    setShowMobileMenu(false);
  };

  const handleSignIn = () => {
    setShowMobileMenu(false);
    window.location.href = `/sign-in?redirect=${encodeURIComponent(path)}`;
  };

  // Auto-expand menus that contain the active page
  React.useEffect(() => {
    if (showMobileMenu) {
      const newOpenMenus = new Set<string>();

      const findAndOpenActiveMenus = (items: MenuItem[], level: number = 0) => {
        items.forEach((item) => {
          if (isActiveOrHasActiveChild(item, path)) {
            const menuKey = `${item.id}-${level}`;
            newOpenMenus.add(menuKey);

            if (item.children) {
              findAndOpenActiveMenus(item.children, level + 1);
            }
          }
        });
      };

      findAndOpenActiveMenus(menus);
      setOpenMenus(newOpenMenus);
    }
  }, [showMobileMenu, path, menus]);

  // Close all menus when mobile menu is closed
  React.useEffect(() => {
    if (!showMobileMenu) {
      setOpenMenus(new Set());
    }
  }, [showMobileMenu]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`bg-primary/80 fixed top-0 left-0 h-full w-full lg:hidden ${
          showMobileMenu
            ? "translate-x-0 opacity-30"
            : "translate-x-[100%] opacity-0 delay-300"
        } z-[998] duration-700`}
        onClick={() => setShowMobileMenu(false)}
      ></div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 flex h-full w-[80%] max-w-[300px] flex-col items-start justify-start gap-8 overflow-y-auto bg-white pb-10 lg:hidden lg:gap-20 ${
          showMobileMenu
            ? "visible translate-x-0 opacity-100 delay-500"
            : "invisible translate-x-[-100%] opacity-50"
        } z-[999] duration-500`}
      >
        {/* Header */}
        <div className="flex w-full items-center justify-between border-b border-gray-100 p-4 sm:p-8">
          <Logo />
          <Button
            variant="danger-outline"
            className="hover:text-primary cursor-pointer rounded-full p-2 text-xl duration-300 sm:!text-2xl"
            onClick={() => setShowMobileMenu(false)}
            aria-label="Close menu"
          >
            <XIcon />
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="w-full px-4">
          <ul className="flex flex-col gap-1">
            {menus.map((menu) => {
              const hasChildren = menu.children && menu.children.length > 0;
              const menuKey = `${menu.id}-0`;
              const isOpen = openMenus.has(menuKey);

              // Check if this top-level menu or any of its children is active
              const isActive = isActiveOrHasActiveChild(menu, path);
              const isDirectlyActive = getPageUrl(menu) === path;

              if (hasChildren) {
                return (
                  <li key={menu.id} className="list-none">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(menuKey, 0);
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between border-b border-gray-100 py-3 text-left font-semibold duration-300 ${
                        isActive
                          ? "text-primary bg-primary/5"
                          : "hover:text-primary"
                      }`}
                    >
                      <span className={isActive ? "font-bold" : ""}>
                        {menu.title}
                      </span>
                      <CaretDownIcon
                        className={`transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        } ${isActive ? "text-primary" : ""}`}
                        size={18}
                      />
                    </button>
                    <AnimateHeight duration={500} height={isOpen ? "auto" : 0}>
                      <ul
                        className={`mt-2 mb-4 flex flex-col ${isActive ? "border-primary/20 ml-2 border-l-2" : ""}`}
                      >
                        {menu.children?.map((subItem) => (
                          <NestedMenuItem
                            key={subItem.id}
                            item={subItem}
                            level={1}
                            onLinkClick={handleLinkClick}
                            openMenus={openMenus}
                            toggleMenu={toggleMenu}
                            path={path}
                          />
                        ))}
                      </ul>
                    </AnimateHeight>
                  </li>
                );
              }

              return (
                <li
                  key={menu.id}
                  className="list-none border-b border-gray-100"
                >
                  <Link
                    href={getPageUrl(menu)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLinkClick();
                    }}
                    className={`block rounded-md px-2 py-3 font-semibold duration-300 ${
                      isDirectlyActive
                        ? "text-primary bg-primary/5 font-bold"
                        : "hover:text-primary"
                    }`}
                  >
                    <span className={isDirectlyActive ? "font-bold" : ""}>
                      {menu.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {/* Sidebar menu items */}
          <div className="mt-6">
            {/* <span className="block mb-2 font-bold text-primary">Sidebar Menu</span> */}
            <ul className="flex flex-col gap-1">
              {_SIDEBAR_MENU.map((item) => (
                <li key={item.id} className="list-none border-b border-gray-100">
                  <Link
                    href={item.link}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center gap-2 rounded-md px-2 py-3 font-semibold duration-300 ${
                      path === item.link || path.startsWith(item.link)
                        ? "text-primary bg-primary/5 font-bold"
                        : "hover:text-primary"
                    }`}
                  >
                    {React.createElement(item.icon, { className: "text-xl" })}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Auth buttons for mobile */}
          {!user && (
            <div className="flex flex-col gap-3 mt-8">
              <Button
                variant="secondary-outline"
                className="w-full"
                onClick={handleSignIn}
              >
                {tran("Sign In")}
              </Button>
              <Button
                href="/sign-up"
                className="w-full"
                onClick={() => setShowMobileMenu(false)}
              >
                {tran("Sign Up")}
              </Button>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
