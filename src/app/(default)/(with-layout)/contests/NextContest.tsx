import { Button } from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useTranslations } from "@/providers/TranslationProviders";
import { ContestApiResponse } from "@/types/contest";
import { getToken } from "@/utils";
import dynamic from "next/dynamic";

const Countdown = dynamic(() => import("@/components/ui/Countdown"), {
  ssr: false,
});
const NextContest = () => {
  const token = getToken();
  const { tran } = useTranslations();
  const { data: contests, isLoading } = useGetQuery<ContestApiResponse>({
    isPublic: !token,
    url: "get-contests",
    params: {
      page: 1,
      per_page: 1,
      sort_column: "start_time",
      sort_by: "asc",
      status: "upcoming",
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-2 text-white md:items-center">
      <p className="text-lg font-medium">{tran("Next Contest Starts")}</p>
      <p className="w-[250px] items-center justify-center text-xl font-semibold md:flex lg:text-3xl">
        {contests?.data[0]?.start_time && (
          <Countdown dateTime={contests?.data[0]?.start_time || ""} />
        )}
      </p>
      <Button
        href={`/contests/${contests?.data[0]?.translation?.slug}`}
        variant="primary-outline"
        className="hover:border-primary border-white text-white hover:text-white max-md:w-fit"
      >
        {tran("View Contest")}
      </Button>
    </div>
  );
};

export default NextContest;
