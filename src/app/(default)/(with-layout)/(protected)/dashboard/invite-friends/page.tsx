/** @format */

"use client";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { AuthStore } from "@/stores/auth";
import {
  CheckCircleIcon,
  CopyIcon,
  LinkIcon,
} from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";
import { useState } from "react";
import toast from "react-hot-toast";

const ShareLinks = dynamic(() => import("@/components/ui/ShareLinks"), {
  ssr: false,
});

export default function InviteFriends() {
  const { tran } = useTranslations();
  const { user } = useAuthStore((state: AuthStore) => state);

  const link = `${window.location.origin}/sign-up?referer=${user?.username}`;

  const [isCopied, setIsCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    toast.success(tran("Link copied to clipboard"));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <div className="border-primary/20 gap-6 rounded-xl border p-4 sm:p-6">
      <h3 className="heading-3 !font-medium">{tran("Share & Earn")}</h3>

      <div className="w-full pt-6">
        <div
          className="border-primary/20 flex w-full cursor-pointer items-center justify-start gap-2 rounded-xl border px-2 py-3 text-slate-500 sm:rounded-full sm:px-6"
          onClick={copyLink}
        >
          <LinkIcon className="block shrink-0 text-xl" />
          <p className="flex-1 max-sm:text-sm">{link}</p>
          <button>
            {isCopied ? (
              <CheckCircleIcon className="text-xl" />
            ) : (
              <CopyIcon className="text-xl" />
            )}
          </button>
        </div>
      </div>
      <p className="pt-2 text-center text-slate-500 max-sm:text-sm">
        {tran("Get 100 coins for every new user you refer")}
      </p>
      {link && (
        <ShareLinks
          link={link}
          text={
            "Play Quizes online and win coins. Refer your friends and get 50 coins for each new user you refer."
          }
        />
      )}
    </div>
  );
}
