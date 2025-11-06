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
            </ul>
          </div>
        </div>
      </li>
    </ul>
  );
}
