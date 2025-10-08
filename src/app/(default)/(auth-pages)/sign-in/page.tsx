/** @format */
import SocialLogin from "@/components/auth/SocialLogin";
import SignInForm from "./SignInForm";
import AuthPageTitle from "../AuthPageTitle";

export default function SignInPage() {
  return (
    <div className="w-full pt-8 sm:pt-20 xl:px-10 2xl:px-[60px]">
      <AuthPageTitle title="Sign In" />
      <div className="flex w-full flex-col gap-3">
        <SignInForm />
        <div className="relative flex items-center justify-start gap-2 pt-8">
          <p className="absolute left-1/2 -translate-x-1/2 bg-white px-2">Or</p>
          <div className="bg-dark5 h-px w-full flex-1"></div>
        </div>

        <div className="flex w-full items-center justify-center gap-2">
          <SocialLogin />
        </div>
      </div>
    </div>
  );
}
