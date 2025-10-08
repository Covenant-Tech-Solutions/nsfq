/** @format */
"use client";

import { Button } from "@/components/ui/Button";
import { _SIDEBAR_MENU } from "@/constants/Sidebar";
import { useTranslations } from "@/providers/TranslationProviders";
import { cn } from "@/utils/cn";
import { ListIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Sidebar = () => {
  const { tran } = useTranslations();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }
  }, [open]);

  const isSameLink = (link: string) => path === link || path.startsWith(link);

  return (
    <>
      <div className="bg-primary/5 col-span-12 flex w-full items-center justify-between rounded-lg p-3 lg:col-span-3 lg:hidden">
        {!open ? (
          <Button
            onClick={toggleSidebar}
            size="sm"
            className="text-2xl lg:hidden"
          >
            <ListIcon />
          </Button>
        ) : (
          <Button
            variant="danger-outline"
            size="sm"
            onClick={toggleSidebar}
            className="text-2xl lg:hidden"
          >
            <XIcon />
          </Button>
        )}
        <span className="heading-5 text-primary">Sidebar Menu</span>
      </div>
      <div className="relative col-span-12 lg:col-span-3">
        <ul
          className={cn(
            "gap-1 overflow-hidden rounded-xl bg-white p-6 lg:sticky lg:top-20 lg:flex lg:flex-col",
            "duration-300 max-lg:absolute max-lg:top-0 max-lg:left-0 max-lg:z-30 max-lg:h-screen max-lg:w-full max-lg:overflow-hidden",
            "before:bg-primary/5 before:absolute before:inset-0 before:z-10",
            open ? `translate-x-0` : `max-lg:translate-x-[-120%]`,
          )}
        >
          {_SIDEBAR_MENU?.map((item) => (
            <li
              key={item.id}
              className="relative z-20"
              onClick={() => setOpen(false)}
            >
              <Link
                key={item.id}
                href={item.link}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 font-medium duration-300 ${
                  isSameLink(item.link)
                    ? "bg-primary text-white"
                    : "hover:bg-primary hover:text-white"
                }`}
              >
                {React.createElement(item.icon, { className: "text-xl" })}
                <span>{tran(item.name)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
