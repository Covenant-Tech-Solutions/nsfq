/** @format */

"use client";
import illus from "@/../public/illustration/bg-shape-3.png";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { usePageComponent } from "@/hooks/usePageComponent";
import { TestimonialsApiResponse } from "@/types";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import moment from "moment";
import dynamic from "next/dynamic";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ImageLoader from "../ui/ImageLoader";

const TestimonialsSkeleton = dynamic(() => import("./TestimonialsSkeleton"), {
  ssr: false,
});

export default function Testimonials({ slug }: Readonly<{ slug: string }>) {
  const { getData } = usePageComponent({
    slug,
    sectionSlug: "testimonials",
  });

  const { data: testimonials, isLoading } = useGetQuery<
    TestimonialsApiResponse[]
  >({
    url: "/testimonials",
    queryKey: "testimonials",
  });

  if (isLoading) {
    return <TestimonialsSkeleton />;
  }

  return (
    <section className="hidden lg:block stp-30 sbp-30 relative overflow-hidden bg-slate-50">
      <div className="bg-secondary/30 absolute -bottom-10 left-0 size-[480px] rounded-full blur-[200px] xl:-left-52"></div>
      <div className="absolute right-0 -bottom-10 size-[480px] rounded-full bg-yellow-100 blur-[200px] xl:-right-20"></div>
      <Image alt="" src={illus} className="absolute bottom-0 left-0 z-10" />
      <div className="custom-container">
        <div className="flex items-center justify-between gap-4">
          <div className="flex max-w-[526px] flex-col items-start justify-start">
            <h2 className="heading-2">
              {getData("title", "What Our Users Say")}
            </h2>
            <p className="text-light2 pt-3 text-lg">
              {getData(
                "description",
                "Discover why users love our quizzes. Fun, educational, and completely engaging",
              )}
            </p>
          </div>
          <div className="flex items-center justify-center text-xl max-[400px]:hidden">
            <button className="ara-prev flex size-12 items-center justify-center rounded-full border border-yellow-400 text-yellow-400 duration-300 hover:bg-yellow-400 hover:text-black">
              <CaretLeftIcon />
            </button>
            <button className="ara-next flex size-12 items-center justify-center rounded-full border border-yellow-400 text-yellow-400 duration-300 hover:bg-yellow-400 hover:text-black">
              <CaretRightIcon />
            </button>
          </div>
        </div>

        <div className="stp-15">
          <Swiper
            loop={true}
            modules={[FreeMode, Navigation]}
            slidesPerView={"auto"}
            spaceBetween={24}
            navigation={{
              nextEl: ".ara-next",
              prevEl: ".ara-prev",
            }}
            breakpoints={{
              600: {
                slidesPerView: 2,
                spaceBetween: 10,
              },

              1300: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
          >
            <div className="swiper-wrapper">
              {testimonials?.map((item: any, idx) => (
                <SwiperSlide className="swiper-slide" key={idx}>
                  <div
                    className={`relative flex items-center justify-start gap-6 overflow-hidden rounded-md border-b-2 border-transparent bg-slate-50/50 p-8 duration-300 hover:border-yellow-400`}
                  >
                    <div className="absolute top-10 -left-16 size-[92px] bg-yellow-400 blur-[120px]"></div>
                    <div className="absolute -right-16 -bottom-10 size-[92px] bg-[#008EFB] blur-[120px]"></div>

                    <div className="flex w-full flex-col items-center justify-center text-center">
                      <div className="flex size-[60px] items-center justify-center overflow-hidden rounded-full">
                        <ImageLoader
                          src={item?.image}
                          alt={item?.name}
                          user={item}
                          width={60}
                          height={60}
                          className="object-cover"
                        />
                      </div>
                      <h5 className="heading-5">{item?.name}</h5>
                      <p className="text-light4 pt-1">
                        {item?.designation} -{" "}
                        {moment(item?.created_at).format("DD MMM, YYYY")}
                      </p>
                      <p className="text-light2 pt-6">{item?.description}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        </div>
      </div>
    </section>
  );
}
