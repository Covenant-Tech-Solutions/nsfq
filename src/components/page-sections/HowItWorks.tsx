/** @format */
"use client";
import illus from "@/../public/illustration/bg-shape-3.png";
import { usePageComponent } from "@/hooks/usePageComponent";
import Image from "next/image";
export default function HowItWorks({ slug }: { slug: string }) {
  const { getData, tran } = usePageComponent({
    slug,
    sectionSlug: "how-it-works",
  });

  return (
    <section className="hidden lg:block">
      <div className="stp-30 sbp-30 relative overflow-hidden bg-slate-50">
        <div className="bg-secondary/30 absolute -bottom-10 left-0 size-[480px] rounded-full blur-[200px] xl:-left-52"></div>
        <div className="absolute right-0 -bottom-10 size-[480px] rounded-full bg-yellow-100 blur-[200px] xl:-right-20"></div>
        <Image alt="" src={illus} className="absolute bottom-0 left-0 z-10" />
        <div className="custom-container flex flex-col items-center justify-center">
          <div className="flex max-w-[526px] flex-col items-center justify-center text-center">
            <h2 className="heading-2">{getData("title", "How It Works")}</h2>
            <p className="text-light2 pt-3 text-lg">
              {getData(
                "description",
                "Create an account, explore quizzes, test your knowledge, and track your progress effortlessly.",
              )}
            </p>
          </div>
          <div className="stp-15 grid gap-6 md:grid-cols-3">
            {getData("steps", []).map((item: any, index: number) => (
              <div className="" key={`how-it-work-step-${index}`}>
                <div className="relative flex items-center justify-center overflow-hidden py-3">
                  <div className="bg-primary/30 absolute -top-12 -left-12 size-[104px] rounded-full blur-[120px]"></div>
                  <div className="bg-secondary/30 absolute -right-12 -bottom-12 size-[104px] rounded-full blur-[120px]"></div>
                  <Image
                    src={item?.image}
                    alt={item.title}
                    width={216}
                    height={208}
                  />
                  <p className="bg-primary heading-4 absolute bottom-3 left-3 rounded-md p-2.5 text-white max-md:text-center">
                    0{index + 1}
                  </p>
                </div>
                <div className="pt-3">
                  <h4 className="heading-4">{tran(item.title)}</h4>
                  <p className="text-light2 pt-2 lg:text-lg">
                    {tran(item.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
