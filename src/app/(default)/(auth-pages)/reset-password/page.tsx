/** @format */

import PasswordResetForm from "./PasswordResetForm";
import AuthPageTitle from "../AuthPageTitle";

export default function ResetPassword() {
  return (
    <div className="w-full pt-8 sm:pt-20 xl:px-10 2xl:px-[60px]">
      <AuthPageTitle title="Reset Password" />
      <PasswordResetForm />
    </div>
  );
}
