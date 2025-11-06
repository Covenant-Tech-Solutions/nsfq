/** @format */
"use client";
import ImageLoader from "@/components/ui/ImageLoader";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import useClickOutside from "@/hooks/useClickOutside";
import { useTranslations } from "@/providers/TranslationProviders";
import { QuizCategoryApiResponse } from "@/types/quiz";
import { cn } from "@/utils/cn";
import { DotsThreeIcon, GlobeIcon } from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
const CategoriesSkeleton = dynamic(() => import("./CategoriesSkeleton"), {
  ssr: false,
});

type CategoriesProps = {
  setSelectedCategory: (category: string) => void;
};

export default function Categories({
  setSelectedCategory,
}: Readonly<CategoriesProps>) {
  const { tran } = useTranslations();
  const { modal, setModal, modalRef } = useClickOutside();

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";

  const { data: categories, isLoading } = useGetQuery<QuizCategoryApiResponse>({
    isPublic: true,
    url: "/contest-categories",
  });

  if (isLoading) {
    return <CategoriesSkeleton />;
  }

  if (!categories?.data?.length) {
    return null;
  }

  const leftWidth = modalRef.current?.getBoundingClientRect().left;
  const rightWidth = window.innerWidth - (leftWidth || 0);
  const modalPosition = rightWidth < 220 ? "right-0" : "left-0";

  return (
    <ul className="flex flex-wrap items-center justify-start gap-3 pt-6 font-medium">
      <li
        onClick={() => setSelectedCategory("all")}
        className={cn(
          "hover:bg-primary/30 flex cursor-pointer items-center justify-start gap-1 rounded-md px-2 py-1 duration-300",
          "all" === categoryParam && "bg-primary/30",
        )}
      >
        <GlobeIcon className="text-primary text-xl" />
        {tran("All")}
      </li>
      {categories?.data.slice(0, 9).map((category) => (
        <li
          onClick={() => {
            setSelectedCategory(category.slug);
          }}
          key={`context-category-${category.id}`}
          className={cn(
            "hover:bg-primary/30 flex cursor-pointer items-center justify-start gap-1 rounded-md px-2 py-1 duration-300",
            category.slug === categoryParam && "bg-primary/30",
          )}
        >
          <ImageLoader
            src={category.icon}
            height={20}
            width={20}
            className="size-5"
          />
          {tran(category.title)}
        </li>
      ))}
      <li className="relative">
        <div className="relative" ref={modalRef}>
          <DotsThreeIcon
            className="cursor-pointer text-xl"
            onClick={() => setModal(!modal)}
          />

          <div
            className={`border-primary/10 absolute top-8 ${modalPosition} z-50 w-[200px] rounded-xl border bg-white px-3 py-2 shadow ${modal ? "visible opacity-100" : "invisible opacity-0"} `}
          >
            <ul className="flex flex-col items-start justify-start gap-2 p-2">
              {categories?.data.slice(9).map((category, idx) => (
                <li
                  onClick={() => {
                    setModal(false);
                    setSelectedCategory(category.slug);
                  }}
                  key={idx}
                  className={cn(
                    "hover:bg-primary/30 flex cursor-pointer items-center justify-start gap-1 rounded-md px-2 py-1 duration-300",
                    category.slug === categoryParam && "bg-primary/30",
                  )}
                >
                  <ImageLoader
                    src={category.icon}
                    height={20}
                    width={20}
                    className="size-5"
                  />
                  {category.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </li>
    </ul>
  );
}
