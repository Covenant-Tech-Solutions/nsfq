"use client";
import ImageLoader from "@/components/ui/ImageLoader";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { AuthStore } from "@/stores/auth";
import { AppInfoType } from "@/types";

const RightBar = () => {
  const { appInfo }: { appInfo: AppInfoType } = useAuthStore(
    (state: AuthStore) => state,
  );
  return (
    <div className="relative flex items-center justify-center overflow-hidden px-8 max-lg:hidden">
      <div className="bg-secondary/30 absolute -top-10 left-0 size-[345px] rounded-full blur-[200px] xl:-left-20"></div>
      <div className="bg-secondary/30 absolute -bottom-10 -left-20 size-[345px] rounded-full blur-[200px]"></div>
      <div className="bg-secondary/30 absolute -top-10 right-0 size-[375px] rounded-full blur-[200px] xl:-right-20"></div>
      <ImageLoader
        src={appInfo?.application_info?.auth_left_sidebar_image}
        alt={appInfo?.application_info?.company_info?.description}
        width={532}
        height={550}
      />
    </div>
  );
};

export default RightBar;
