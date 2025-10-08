/** @format */

"use client";
import illus from "@/../public/illustration/bg-shape-3.png";
import img from "@/../public/illustration/unique-quiz-feature-img.png";
import { usePageComponent } from "@/hooks/usePageComponent";
import Image from "next/image";
import { Button } from "../ui/Button";
import ImageLoader from "../ui/ImageLoader";
export default function UniqueQuizFeatures({ slug }: { slug: string }) {
  const { getData } = usePageComponent({
    slug,
    sectionSlug: "unique-quiz-features",
  });
  return (
    <section className="stp-30 sbp-30 relative overflow-hidden bg-slate-50">
      <div className="bg-secondary/30 absolute -bottom-10 left-0 size-[480px] rounded-full blur-[200px] xl:-left-52"></div>
      <div className="absolute right-0 -bottom-10 size-[480px] rounded-full bg-yellow-100 blur-[200px] xl:-right-20"></div>
      <Image
        alt={getData("title", "Unique Quiz Features")}
        src={illus}
        className="absolute bottom-0 left-0 z-10"
      />
      <div className="custom-container relative z-10 grid grid-cols-12 gap-6">
        <div className="col-span-12 flex flex-col items-start justify-start lg:col-span-6">
          <div className="flex max-w-[526px] flex-col items-start justify-start pb-8">
            <h2 className="heading-2">
              {getData("title", "Unique Quiz Features")}
            </h2>
            <p className="text-light2 pt-3 text-lg">
              {getData(
                "description",
                "Explore unique quiz features designed to challenge, entertain, and educate. Dive into interactive quizzes and enhance your knowledge effortlessly.",
              )}
            </p>
            <div className="flex items-start justify-start pt-8">
              <Button href={getData("button.link", "/quizzes")} size="lg">
                {getData("button.text", "Start Now")}
              </Button>
            </div>
          </div>
          <Image src={getData("image", img)} alt="" width={562} height={501} />
        </div>
        <div className="col-span-12 flex flex-col justify-start gap-6 lg:col-span-6">
          {getData("features", []).map((item: any, index: number) => (
            <div
              className="relative flex items-center justify-start gap-6 overflow-hidden bg-slate-50/50 p-6 sm:p-8"
              key={index}
            >
              <div className="absolute -bottom-16 left-[50%] size-[92px] bg-[linear-gradient(0deg,#00D94A_0%,#00D94A_100%)] blur-[120px]"></div>
              <div className="absolute top-10 -left-16 size-[92px] bg-yellow-400 blur-[120px]"></div>
              <div className="absolute -right-16 -bottom-10 size-[92px] bg-[#008EFB] blur-[120px]"></div>

              <ImageLoader
                src={item?.image}
                alt={item?.title}
                className="max-sm:size-20"
                width={100}
                height={100}
              />
              <div className="flex flex-col items-start justify-start">
                <h4 className="heading-4">{item?.title}</h4>
                <p className="text-light2 max-w-[400px] pt-2 text-base sm:text-lg">
                  {item?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
