/** @format */

"use client";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useMenu } from "@/providers/MenuProvider";
import { useTranslations } from "@/providers/TranslationProviders";
import { AppInfoType, SocialMediaItem } from "@/types";
import { getPageUrl } from "@/utils/helper";
import { ChatsIcon, MapPinIcon, PhoneCallIcon } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo } from "react";
import Logo from "../ui/Logo";
import PhosphorIcon from "../ui/PhosphorIcon";
import Subscribe from "./Subscribe";

const SelectLanguage = dynamic(
  () => import("@/features/global/SelectLanguage"),
  {
    ssr: false,
  },
);

export default function Footer() {
  const { tran } = useTranslations();
  const { appInfo }: { appInfo: AppInfoType } = useAuthStore((state) => state);

  // social links - no need for useMemo here
  const socialLinks = appInfo?.application_info?.social_medias ?? [];

  const { menus } = useMenu();

  const { quickLinks, resourcesLinks } = useMemo(() => {
    if (!menus) {
      return { quickLinks: [], resourcesLinks: [] };
    }

    const getSortedMenuItems = (slug: string) => {
      const menu = menus.find((item) => item.slug === slug);
      return menu ? [...menu.items].sort((a, b) => a.order - b.order) : [];
    };

    return {
      quickLinks: getSortedMenuItems("quick-links"),
      resourcesLinks: getSortedMenuItems("resources-menu"),
    };
  }, [menus]);

  if (!appInfo) {
    return null;
  }

  return (
    <section className="stp-30 relative overflow-hidden">
      <div className=" ">
        <Subscribe />
        <div className="sbp-30 relative overflow-hidden pt-[200px]">
          <div className="bg-secondary/50 absolute -bottom-40 left-0 size-[480px] rounded-full blur-[200px] xl:-left-40"></div>
          <div className="bg-primary/40 absolute right-0 -bottom-40 size-[480px] rounded-full blur-[200px] xl:-right-40"></div>
          <div className="custom-container relative gap-6 max-[450px]:grid-cols-1 max-lg:grid max-lg:grid-cols-2 lg:flex lg:items-start lg:justify-between">
            <div className="flex flex-col items-start justify-start">
              <Logo />
              <p className="text-light3 max-w-[250px] py-6">
                {appInfo?.application_info?.company_info?.description}
              </p>
              <div className="flex flex-wrap items-center justify-start gap-2">
                {socialLinks.map((item: SocialMediaItem, index: number) => (
                  <Link
                    href={item?.link || "#"}
                    className="bg-dark3 hover:bg-primary group flex size-10 cursor-pointer items-center justify-center rounded-full duration-300 hover:text-white sm:size-12"
                    key={index}
                  >
                    <PhosphorIcon iconName={item?.icon} size={20} />
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-start justify-start">
              <h3 className="heading-3">{tran("Quick Links")}</h3>
              <ul className="text-light3 flex flex-col gap-4 pt-6 text-lg">
                {quickLinks.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={getPageUrl(item)}
                      className="hover:text-primary duration-300"
                    >
                      {tran(item.title)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start justify-start">
              <h3 className="heading-3">{tran("Resources")}</h3>
              <ul className="text-light3 flex flex-col gap-4 pt-6 text-lg">
                {resourcesLinks.map((item, index) => (
                  <li key={index}>
                    <Link href={getPageUrl(item)}>{tran(item.title)}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start justify-start">
              <h3 className="heading-3">{tran("Contact")}</h3>
              <ul className="text-light3 flex flex-col gap-4 pt-6 text-lg">
                <li>
                  <Link
                    className="flex items-center justify-start gap-2"
                    href={
                      "tel:" + appInfo?.application_info?.company_info?.phone
                    }
                  >
                    <PhoneCallIcon className="text-xl" weight="fill" />
                    {appInfo?.application_info?.company_info?.phone}
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center justify-start gap-2"
                    href={
                      "mailto:" + appInfo?.application_info?.company_info?.email
                    }
                  >
                    <ChatsIcon weight="fill" className="text-xl" />
                    {appInfo?.application_info?.company_info?.email}
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center justify-start gap-2"
                    href={appInfo?.application_info?.address?.location || "#"}
                  >
                    <MapPinIcon weight="fill" className="text-xl" />
                    {tran("View on Google Maps")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary">
        <div className="custom-container relative z-10 flex items-center justify-between gap-3 py-2 text-center text-white">
          <div className="flex items-center justify-start gap-3">
            <p>
              {tran("Copyright")} @ {new Date().getFullYear()}{" "}
              {appInfo?.application_info?.footer_text}{" "}
              {appInfo?.application_info?.company_info?.name}
            </p>
          </div>
          <div>
            <SelectLanguage />
          </div>
        </div>
      </div>
    </section>
  );
}
