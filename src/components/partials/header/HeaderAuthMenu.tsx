/** @format */

import coindImg from "@/../public/add-coin-icon.svg";
import { FirebaseNotification } from "@/components/partials/header/Notification";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { AuthStore } from "@/stores/auth";
import { GearIcon, UserIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ImageLoader from "../../ui/ImageLoader";

const HeaderAuthMenu = () => {
  const { user, logout, appInfo } = useAuthStore((state: AuthStore) => state);
  const { tran } = useTranslations();

  const currentPath = usePathname();

  const handleRedirect = () => {
    window.location.href = `/sign-in?redirect=${encodeURIComponent(currentPath)}`;
  };

  return user ? (
    <div className="flex items-center justify-start gap-1 sm:gap-3">
      
      <div className="bg-primary/5 border-primary/10 flex items-center justify-start gap-1 rounded-md border px-3 py-1 sm:gap-3 sm:px-4 sm:py-2.5">
        <ImageLoader
          src={coindImg}
          alt=""
          className="size-5 sm:size-6"
          height={24}
          width={24}
        />
        <div>
          <p className="flex items-center justify-start gap-1 font-medium sm:text-lg">
            {user.coins}
          </p>
        </div>
      </div>

      <div className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="focus-visible:outline-none">
            <button className="border-primary rounded-full border-2 p-0.5">
              <ImageLoader
                src={user?.avatar}
                alt=""
                className="size-8 rounded-full sm:size-10"
                height={32}
                width={32}
                user={user}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="p-0">
              <Link
                href="/dashboard/profile"
                className="flex w-full items-center justify-start gap-2 p-2"
              >
                {" "}
                <UserIcon />
                <span className=" ">{tran("Profile")}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="p-0">
              <button
                className="flex w-full items-center justify-start gap-2 p-2"
                onClick={logout}
              >
                {" "}
                <GearIcon />
                <span className=" ">{tran("Logout")}</span>
              </button>
            </DropdownMenuItem>

            <DropdownMenuItem className="p-0">
              {appInfo && <FirebaseNotification appInfo={appInfo} />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-start gap-3 text-sm font-medium">
      <Button
        variant="secondary-outline"
        onClick={handleRedirect}
        className="max-sm:px-2 max-sm:py-1"
      >
        {tran("Sign In")}
      </Button>
      <Button href={"/sign-up"} className="max-sm:px-2 max-sm:py-1">
        {tran("Sign Up")}
      </Button>
    </div>
  );
};

export default HeaderAuthMenu;
