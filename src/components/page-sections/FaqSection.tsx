/** @format */

"use client";
import illusImg from "@/../public/faq-illus.png";
import { usePageComponent } from "@/hooks/usePageComponent";
import { useTranslations } from "@/providers/TranslationProviders";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

const AnimateHeight = dynamic(() => import("react-animate-height"), {
  ssr: false,
});

export default function FaqSection({ slug }: { slug: string }) {
  const [show, setShow] = useState(0);
  const { tran } = useTranslations();

  const { getData } = usePageComponent({
    slug,
    sectionSlug: "faq-section",
  });

  return (
    <section className="stp-30 sbp-30">
      <div className="custom-container grid grid-cols-12 gap-6">
        <div className="col-span-12 flex flex-col items-start justify-start lg:col-span-6">
          <div className="flex max-w-[526px] flex-col items-start justify-start">
            <h2 className="heading-2">
              {" "}
              {getData("title", "Frequently Asked Questions")}
            </h2>
            <p className="text-light2 pt-3 text-lg">
              {getData(
                "description",
                "Discover why users love our quizzes. Fun, educational, and completely engaging",
              )}
            </p>
          </div>
          <Image src={illusImg} alt="" width={562} height={501} />
        </div>
        <div className="col-span-12 flex flex-col justify-start gap-3 sm:gap-6 lg:col-span-6">
          {getData("faqs", []).map(
            (item: { question: string; answer: string }, idx: number) => (
              <div
                key={idx}
                onClick={() => setShow(idx === show ? NaN : idx)}
                className={`relative flex items-center justify-start gap-6 overflow-hidden rounded-md bg-slate-50/50 px-5 py-6 ${idx === show ? "border-b-2 border-yellow-400" : "border border-slate-200"} cursor-pointer duration-300`}
              >
                <div className="absolute -bottom-16 left-[50%] size-[92px] bg-[linear-gradient(0deg,#00D94A_0%,#00D94A_100%)] blur-[120px]"></div>
                <div className="absolute top-10 -left-16 size-[92px] bg-yellow-400 blur-[120px]"></div>
                <div className="absolute -right-16 -bottom-10 size-[92px] bg-[#008EFB] blur-[120px]"></div>

                <div className="flex w-full flex-col items-start justify-start">
                  <div className="flex w-full items-center justify-between gap-4">
                    <h5 className="heading-5">{tran(item.question)}</h5>
                    <div>
                      <PlusIcon className="text-2xl" />
                    </div>
                  </div>
                  <AnimateHeight height={show === idx ? "auto" : 0}>
                    <p className="text-light2 pt-2 text-base sm:text-lg">
                      {tran(item.answer)}
                    </p>
                  </AnimateHeight>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
