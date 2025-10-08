/** @format */

import ImageLoader from "@/components/ui/ImageLoader";
import clsx from "clsx";
import dynamic from "next/dynamic";

const DataNotFound = dynamic(() => import("@/components/ui/DataNotFound"), {
  ssr: false,
});

const BadgesList = ({ badges, tran }: { badges: any; tran: any }) => {
  if (!badges?.length)
    return (
      <DataNotFound
        title="No Badges Found"
        message="The badges you are looking for does not exist."
      />
    );
  return (
    <div className="grid gap-3 pt-4 sm:grid-cols-2 lg:grid-cols-3">
      {badges.map((badge: any) => {
        const isEarned = !!badge.user_badge;

        return (
          <div
            key={badge?.id}
            className={clsx(
              "flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center",
              {
                "border-green-500 bg-green-50": isEarned,
                "border-slate-200 bg-slate-100 opacity-60": !isEarned,
              },
            )}
          >
            <div className="flex shrink-0 items-start justify-start overflow-hidden rounded-full">
              <ImageLoader
                src={badge?.icon}
                alt={badge?.title}
                height={100}
                width={100}
                className={clsx({ grayscale: !isEarned }, "size-20")}
              />
            </div>
            <div className="pt-2">
              <p
                className={clsx("text-lg font-medium", {
                  "text-green-700": isEarned,
                  "text-slate-700": !isEarned,
                })}
              >
                {tran(badge?.title)}
              </p>
              <p className="pt-1 text-sm text-slate-500">
                {tran(badge?.description)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BadgesList;
