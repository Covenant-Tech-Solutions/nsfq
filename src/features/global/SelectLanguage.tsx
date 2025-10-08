/** @format */
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "@/providers/TranslationProviders";

import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { cn } from "@/utils/cn";
import { useEffect } from "react";

type Props = {
  className?: string;
};

export default function SelectLanguage({ className }: Props) {
  const { locale, setLanguage } = useTranslations();
  const { data: langData } = useGetQuery({
    url: "/langs",
  });

  useEffect(() => {
    if (locale.code === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [locale.code]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus-visible:outline-none">
        <button
          className={cn(
            "bg-primary/20 rounded border border-slate-400 px-2 py-1 text-sm",
            className,
          )}
        >
          {locale.name}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {langData?.map((item: any) => (
          <DropdownMenuItem
            className={cn(
              "text-sm text-black",
              locale.code === item.code && "bg-primary/20",
            )}
            key={item.code}
            onClick={() => setLanguage({ name: item.name, code: item.code })}
          >
            {item.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
