/** @format */

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "@/providers/TranslationProviders";
import {
  CheckCircleIcon,
  CopyIcon,
  FacebookLogoIcon,
  LinkedinLogoIcon,
  LinkIcon,
  ShareNetworkIcon,
  XLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "next-share";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ShareLinks({
  link,
  text,
}: {
  link: string;
  text: string;
}) {
  const { tran } = useTranslations();

  const [isCopied, setIsCopied] = useState(false);
  const copyLink = () => {
    navigator.clipboard.writeText(link);
    toast.success(tran("Link copied to clipboard"));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus-visible:outline-none">
        <button className="bg-dark3 hover:bg-primary group mx-auto mt-6 flex size-10 cursor-pointer items-center justify-center rounded-full duration-300 sm:size-12">
          <ShareNetworkIcon
            className="stroke-black duration-300 group-hover:text-white"
            size={20}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="center"
        className="border-none bg-transparent bg-none shadow-none before:bg-transparent"
      >
        <div className="bg-primary border-primary rounded-lg border p-4">
          <div className="flex items-center justify-center gap-2">
            <FacebookShareButton key="facebook" url={link} quote={text}>
              <span className="bg-dark3 hover:bg-secondary group flex size-10 cursor-pointer items-center justify-center rounded-full duration-300 sm:size-12">
                <FacebookLogoIcon
                  className="stroke-black duration-300 group-hover:text-white"
                  size={20}
                />
              </span>
            </FacebookShareButton>
            <TwitterShareButton key="twitter" url={link} title={text}>
              <span className="bg-dark3 hover:bg-secondary group flex size-10 cursor-pointer items-center justify-center rounded-full duration-300 sm:size-12">
                <XLogoIcon
                  className="stroke-black duration-300 group-hover:text-white"
                  size={20}
                />
              </span>
            </TwitterShareButton>
            <LinkedinShareButton key="linkedin" url={link}>
              <span className="bg-dark3 hover:bg-secondary group flex size-10 cursor-pointer items-center justify-center rounded-full duration-300 sm:size-12">
                <LinkedinLogoIcon
                  className="stroke-black duration-300 group-hover:text-white"
                  size={20}
                />
              </span>
            </LinkedinShareButton>
          </div>

          <div
            className="mt-4 flex w-full max-w-[400px] cursor-pointer items-center justify-start gap-2 rounded-xl border border-white bg-white px-2 py-3 text-slate-500 sm:rounded-full sm:px-6"
            onClick={copyLink}
          >
            <LinkIcon className="block shrink-0 text-xl" />
            <p className="max-w-[200px] flex-1 overflow-hidden whitespace-nowrap max-sm:text-sm sm:max-w-[300px]">
              {link}
            </p>
            <button>
              {isCopied ? (
                <CheckCircleIcon className="text-secondary text-xl" />
              ) : (
                <CopyIcon className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
