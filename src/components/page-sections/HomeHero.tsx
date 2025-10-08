/** @format */

"use client";
import heroImg from "@/../public/hero-img.png";
import quiz_shape_image from "@/../public/quize-Shape.png";
import shape from "@/../public/Shape.png";
import { usePageComponent } from "@/hooks/usePageComponent";
import Image from "next/image";
import Typewriter from "typewriter-effect";
import { Button } from "../ui/Button";
export default function HomeHero({ slug }: { slug: string }) {
  const { getData } = usePageComponent({ slug, sectionSlug: "home-hero" });
  return (
    <section className="0 relative h-full max-h-[1200px] overflow-hidden pt-28 lg:pt-34 xl:pt-30">
      <Image
        src={shape}
        alt={"illustration"}
        className="absolute top-0 right-0"
        width={561}
        height={448}
      />
      <div className="bg-secondary/30 absolute -top-52 left-0 size-[480px] rounded-full blur-[200px] xl:-left-52"></div>
      <div className="bg-secondary/30 absolute -bottom-52 left-0 size-[480px] rounded-full blur-[200px] xl:-left-52"></div>
      <div className="bg-secondary/30 absolute right-0 -bottom-10 size-[480px] rounded-full blur-[200px] xl:-right-20"></div>

      <div className="relative z-20 flex items-center justify-start max-2xl:px-6 max-md:flex-col max-md:pt-20 max-sm:pt-16 2xl:ml-[calc((100%-1296px)/2)]">
        <div className="relative z-10 max-w-[720px]">
          <Image
            src={quiz_shape_image}
            alt=""
            className="3xl:-top-28 3xl:-left-28 max-3xl:w-32 absolute -top-24 -left-10 max-md:w-24"
            width={157}
            height={157}
          />
          <p className="display-1 leading-[130%] uppercase max-[400px]:!text-4xl">
            {getData("title", "Test Your Knowledge")}
          </p>
          <span className="text-secondary display-1 leading-[130%] uppercase underline max-[400px]:!text-5xl">
            <Typewriter
              options={{
                strings: getData("text-slider", "Math Quiz"),
                autoStart: true,
                loop: true,
              }}
            />
          </span>{" "}
          <div className="flex items-start justify-start pt-8">
            <Button href={getData("button.link", "/quizzes")} size="lg">
              {getData("button.text", "Start Now")}
            </Button>
          </div>
        </div>
        <div className="w-full max-w-[800px] md:-ml-32 xl:-ml-48">
          <Image
            src={getData("image", heroImg)}
            className="h-full object-cover"
            alt={getData("title", "Test your knowledge")}
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </section>
  );
}
