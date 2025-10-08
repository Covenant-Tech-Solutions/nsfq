/** @format */
"use client";
import bgShape2 from "@/../public/bg-shape-2.png";
import { useTranslations } from "@/providers/TranslationProviders";
import { CaretDoubleRightIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";

export default function Breadcrumb({ title }: { title: string }) {
  const { tran } = useTranslations();
  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-0 left-0">
        <Image src={bgShape2} alt="" />
      </div>
      <div className="bg-secondary/30 absolute -top-10 left-0 size-[480px] rounded-full blur-[200px] xl:-left-20"></div>
      <div className="bg-secondary/30 absolute -top-10 right-0 size-[300px] rounded-full blur-[200px] xl:-right-20 xl:size-[480px]"></div>
      <div className="custom-container relative z-10 flex flex-col items-center justify-center gap-6 pt-30 pb-16">
        <h1 className="text-4xl font-black capitalize lg:text-5xl">{title}</h1>
        <ul className="flex items-center justify-center gap-1">
          <li className="hover:text-primary text-lg font-medium uppercase duration-300">
            <Link href={"/"}>{tran("home")}</Link>
          </li>
          <li>
            <CaretDoubleRightIcon />
          </li>
          <li className="text-lg font-medium capitalize">{tran(title)}</li>
        </ul>
      </div>
    </div>
  );
}
