/** @format */

import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { AuthStore } from "@/stores/auth";
import toast from "react-hot-toast";
export default function TwoFactorAuthToggle() {
  const { tran } = useTranslations();
  const { user, getUser } = useAuthStore((state: AuthStore) => state);
  const { mutate: toggle2FA } = useQueryMutation({
    url: "/profile/2fa/toggle",
  });

  const enableTwoFactorAuth = () => {
    toggle2FA(
      {
        is_2fa_enabled: !user?.is_2fa_enabled,
      },
      {
        onSuccess: (response: any) => {
          toast.success(tran(response?.data?.message));
          getUser();
        },
      },
    );
  };

  return (
    <div className="mt-6 rounded-lg bg-white p-6 pt-6">
      <div className="flex flex-col pb-1">
        <p className="text-xl font-medium">{tran("Preferences")}</p>
        <div className="flex items-center justify-between pt-6">
          <p className="text-light4">
            {tran("Enable Two Factor Authentication")}
          </p>

          <div className="">
            <button
              onClick={enableTwoFactorAuth}
              className="bg-primary/10 relative h-7 w-13 rounded-full"
            >
              <span
                className={`absolute top-[2px] size-6 rounded-full ${user?.is_2fa_enabled ? "bg-primary left-[25px]" : "left-[3px] bg-white"} duration-500`}
              ></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
