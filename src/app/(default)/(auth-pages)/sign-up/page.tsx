import SocialLogin from "@/components/auth/SocialLogin";
import { getUserCountryCode } from "@/utils/geolocation";
import AuthPageTitle from "../AuthPageTitle";
import SignUpForm from "./SignUpForm";

export default async function SignUpPage() {
  const countryCode = await getUserCountryCode();

  return (
    <div className="w-full pt-8 sm:pt-20 xl:px-10 2xl:px-[60px]">
      <AuthPageTitle title="Welcome back to QuiziX" />
      <div className="flex flex-col gap-3">
        <SignUpForm countryCode={countryCode} />

        <div className="flex items-center justify-start gap-2 pt-8">
          <p className="absolute left-1/2 -translate-x-1/2 bg-white px-2">
            Or sign in with
          </p>
          <div className="bg-dark5 h-px w-full flex-1"></div>
        </div>
        <div className="flex w-full items-center justify-center gap-2">
          <SocialLogin />
        </div>
      </div>
    </div>
  );
}
