import ForgotPasswordForm from "./ForgotPasswordForm";
import ForgotPasswordTitle from "./ForgotPasswordTitle";

export default function ForgotPassword() {
  return (
    <div className="w-full pt-8 sm:pt-20 xl:px-10 2xl:px-[60px]">
      <ForgotPasswordTitle />
      <ForgotPasswordForm />
    </div>
  );
}
