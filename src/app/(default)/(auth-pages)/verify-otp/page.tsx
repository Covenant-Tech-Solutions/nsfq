import OtpForm from "@/components/auth/OtpForm";
import AuthPageTitle from "../AuthPageTitle";

export default function VerifyOTP() {
  return (
    <div className="w-full pt-8 sm:pt-20 xl:px-10 2xl:px-[60px]">
      <AuthPageTitle title="Verify OTP" />
      <OtpForm />
    </div>
  );
}
