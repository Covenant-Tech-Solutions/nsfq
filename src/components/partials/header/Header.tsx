/** @format */

"use client";
import { useMenu } from "@/providers/MenuProvider";
import { ListIcon } from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const Logo = dynamic(() => import("../../ui/Logo"), {
  ssr: false,
});

const HeaderAuthMenu = dynamic(() => import("./HeaderAuthMenu"), {
  ssr: false,
});

const MenuItems = dynamic(() => import("./MenuItems"), {
  ssr: false,
});

const MobileNavMenu = dynamic(() => import("./MobileNavMenu"), {
  ssr: false,
});

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { menus } = useMenu();

  const filterHeaderMenu = useMemo(() => {
    const headerMenu = menus?.find((item) => item.slug === "header-menu");
    if (!headerMenu) return [];
    return headerMenu.items.sort((a, b) => a.order - b.order);
  }, [menus]);

  const [showHeader, setShowHeader] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setShowHeader(true);
    } else {
      setShowHeader(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 ${showHeader ? "bg-white shadow-md" : "bg-transparent"}`}
    >
      <div className="custom-container flex items-center justify-between py-4">
        <div className="flex items-center justify-start gap-1 sm:gap-2">
          <button className="lg:hidden" onClick={() => setShowMobileMenu(true)}>
            <ListIcon size={24} />
          </button>
          <Logo />
        </div>
        <nav className="max-lg:hidden">
          <MenuItems item={filterHeaderMenu} />
        </nav>

        {/* mobile menu */}
        <MobileNavMenu
          menus={filterHeaderMenu}
          setShowMobileMenu={setShowMobileMenu}
          showMobileMenu={showMobileMenu}
        />
        {/* user menu and auth menu */}
        <HeaderAuthMenu />
      </div>
    </header>
  );
}
