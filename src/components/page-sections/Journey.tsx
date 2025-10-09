/** @format */

"use client";
import aboutImage from "@/../public/illustration/about.webp";
import illus from "@/../public/illustration/bg-shape-3.png";
import { usePageComponent } from "@/hooks/usePageComponent";
import { CheckIcon, PhoneCallIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/Button";

export default function Journey({ slug }: { readonly slug: string }) {
  const [selectedTab, setSelectedTab] = useState(0);
  const { getData, tran } = usePageComponent({
    slug,
    sectionSlug: "the-journey",
  });
  return (
    <section className="hidden lg:block stp-30 sbp-30 relative overflow-hidden bg-slate-50">
      <div className="bg-secondary/30 absolute -bottom-10 left-0 size-[480px] rounded-full blur-[200px] xl:-left-52"></div>
      <div className="absolute right-0 -bottom-10 size-[480px] rounded-full bg-yellow-100 blur-[200px] xl:-right-20"></div>
      <Image alt="" src={illus} className="absolute bottom-0 left-0 z-10" />

      <div className="custom-container relative z-20 grid grid-cols-12 items-center gap-6">
        <div className="col-span-12 lg:col-span-6">
          <Image
            alt={getData("title", "The Journey Behind Our Quizzes")}
            width={500}
            height={500}
            src={getData("image", aboutImage)}
            className="mx-auto rounded-lg"
          />
        </div>
        <div className="col-span-12 lg:col-span-6 2xl:col-span-5 2xl:col-start-8">
          <div className="flex flex-col items-center justify-center">
            <h2 className="heading-2">
              {getData("title", "The Journey Behind Our Quizzes")}
            </h2>
            <p className="text-light2 pt-3 text-lg">
              {tran(
                getData(
                  "description",
                  "we’re dedicated revolutionizing the way the world uses energy. mission is to provide reliable, affordable,",
                ),
              )}
            </p>
          </div>
          <div className="pt-8">
            <div className="bg-primary flex items-center justify-start pt-1">
              {getData("tab-data", []).map(
                (item: { title: string; content: string }, index: number) => (
                  <p
                    key={index}
                    onClick={() => setSelectedTab(index)}
                    className={`flex w-full cursor-pointer items-center justify-center py-3 text-center text-base font-medium duration-400 sm:text-lg ${
                      index === selectedTab
                        ? "bg-primary text-white"
                        : "bg-white"
                    }`}
                  >
                    {tran(item?.title)}
                  </p>
                ),
              )}
            </div>
            <p className="text-light2 pt-6 text-lg">
              {tran(getData("tab-data", [])[selectedTab]?.content)}
            </p>
            <div className="border-light4/30 my-8 border-b"></div>
            <div className="grid w-full grid-cols-2 gap-4">
              {getData("features", []).map((item: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-start gap-3"
                >
                  <div className="bg-secondary flex size-6 shrink-0 items-center justify-center rounded-full">
                    <CheckIcon className="text-xs" />
                  </div>
                  <p className="text-light2">{tran(item)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-start gap-4 pt-8 max-sm:flex-col sm:items-center sm:pt-12">
              <Button className="w-fit" href={"/contact-us"}>
                {tran("Contact Us")}
              </Button>
              <div className="flex items-center justify-start gap-3">
                <div className="bg-secondary flex size-13 shrink-0 items-center justify-center rounded-full">
                  <PhoneCallIcon className="text-2xl" />
                </div>
                <div className="flex flex-col">
                  <p className="text-light2">{tran("Call For Help")}</p>
                  <a
                    href={`tel:${getData("phone_number")}`}
                    className="pt-1 text-lg font-medium"
                  >
                    {getData("phone_number")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
