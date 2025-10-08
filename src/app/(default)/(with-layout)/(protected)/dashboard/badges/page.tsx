/** @format */

"use client";
import Loader from "@/components/ui/Loader";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useTranslations } from "@/providers/TranslationProviders";
import BadgesList from "./BadgeList";

export default function BadgesPage() {
  const { tran } = useTranslations();
  const { data: badges, isLoading } = useGetQuery({
    url: `/profile/badges`,
  });

  if (isLoading) return <Loader />;

  return (
    <div className="bg-primary/5 rounded-xl p-2 sm:p-6">
      <h3 className="heading-3 !font-medium">{tran("Badges")}</h3>
      <div className="flex flex-col gap-6 pt-6">
        <div className="border-primary/10 rounded-xl border bg-white p-2 sm:p-6">
          <BadgesList badges={badges} tran={tran} />
        </div>
      </div>
    </div>
  );
}
