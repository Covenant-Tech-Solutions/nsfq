import TwoFAVerifyForm from "@/components/auth/2faVerifyForm";
import AuthPageTitle from "../AuthPageTitle";

export default function Verify2fa() {
  return (
    <div className="w-full pt-8 sm:pt-20 xl:px-10 2xl:px-[60px]">
      <AuthPageTitle title="Verify 2FA OTP" />
      <TwoFAVerifyForm />
    </div>
  );
}
