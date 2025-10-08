/** @format */

"use client";

import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { AuthStore } from "@/stores/auth";
import {
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  PencilLineIcon,
} from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";

const ImageLoader = dynamic(() => import("@/components/ui/ImageLoader"), {
  ssr: false,
});

const Loader = dynamic(() => import("@/components/ui/Loader"), {
  ssr: false,
});

export default function ProfilePage() {
  const { tran } = useTranslations();
  const { user, getUser } = useAuthStore((state: AuthStore) => state);
  const [avatar, setAvatar] = useState<{
    link: string | null;
    file: File | null;
  }>({
    link: user?.avatar,
    file: null,
  });

  useEffect(() => {
    if (user?.avatar) {
      setAvatar({
        link: user.avatar,
        file: null,
      });
    }
  }, [user?.avatar]);

  const { data, isLoading } = useGetQuery({
    url: "/profile/statistics",
    queryKey: "user-profile",
  });

  const { mutate: updateAvatarMutate, isLoading: isUploading } =
    useQueryMutation({
      url: "/profile/update-profile",
    });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar({
        link: URL.createObjectURL(file),
        file,
      });

      updateAvatarMutate(
        { avatar: file },
        {
          onSuccess: () => {
            getUser();
            toast.success(tran("Avatar updated successfully."));
          },
        },
      );
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="bg-primary/5 grid grid-cols-2 gap-6 rounded-xl p-6">
      <div className="col-span-2 flex flex-wrap items-center justify-start gap-2 max-[400px]:flex-col sm:gap-6">
        <div className="relative">
          {isUploading ? (
            <div className="h-[120px] w-[120px] rounded-full bg-gray-200">
              <LoaderIcon className="absolute top-1/2 left-1/2 h-[24px] w-[24px] -translate-x-1/2 -translate-y-1/2" />
            </div>
          ) : (
            <ImageLoader
              src={avatar.link}
              alt={user?.full_name}
              height={120}
              width={120}
              user={user}
              className="size-30 shrink-0 rounded-full object-cover"
            />
          )}
          <label htmlFor="avatar">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="avatar"
            />
            <span className="bg-primary absolute right-1 bottom-1 rounded-full p-1 text-xl text-white">
              <PencilLineIcon />
            </span>
          </label>
        </div>
        <div className="pt-4">
          <p className="heading-4">{user?.full_name}</p>
          <p className="text-light4">@{user?.username}</p>
          <div className="flex flex-wrap items-center justify-start gap-2 pt-3">
            <div className="flex items-center justify-start gap-1">
              <FireIcon className="text-lg text-red-400" />
              <p>{data?.streak}</p>
            </div>
            <div className="flex items-center justify-start gap-1">
              <ClockIcon className="text-primary text-lg" />
              <p>
                {tran("Member since")} {data?.member_since}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-primary/20 col-span-2 border-t p-6">
        <div className="flex items-center justify-start gap-2">
          <ChartBarIcon className="text-primary text-xl" />
          <h5 className="heading-5">{tran("Quiz Performance")}</h5>
        </div>
        <div className="flex flex-wrap items-center justify-start gap-3 pt-4">
          <div className="border-primary/20 flex min-w-[150px] flex-1 flex-col items-center justify-center gap-2 rounded-xl border bg-white p-6 text-center">
            <p className="text-3xl font-medium">{data?.total_quizzes}</p>
            <p className="text-slate-500">{tran("Total Quizzes")}</p>
          </div>
          <div className="border-primary/20 flex min-w-[150px] flex-1 flex-col items-center justify-center gap-2 rounded-xl border bg-white p-6 text-center">
            <p className="text-3xl font-medium">{data?.average_score}</p>
            <p className="text-slate-500">{tran("Average Score")}</p>
          </div>
          <div className="border-primary/20 flex min-w-[150px] flex-1 flex-col items-center justify-center gap-2 rounded-xl border bg-white p-6 text-center">
            <p className="text-3xl font-medium">
              {tran("Top")} {data?.rank_percentile}
            </p>
            <p className="text-slate-500">{tran("This Month")}</p>
          </div>
        </div>
        <div className="pt-6">
          <div className="text-light4 flex items-center justify-between pb-2">
            <p>{tran("Level Progress")}</p>
            <p>{data?.level_progress || 0}%</p>
          </div>
          <div className="bg-primary/10 relative h-2 w-full rounded-full">
            <div
              style={{ width: `${data?.level_progress}%` }}
              className={`bg-primary absolute top-0 left-0 h-2 rounded-full`}
            ></div>
          </div>
          <p className="text-light4 pt-2">
            {tran("Level")} {tran(data?.level_number)} -{" "}
            {tran(data?.level_title)}
          </p>
        </div>
      </div>
    </div>
  );
}
