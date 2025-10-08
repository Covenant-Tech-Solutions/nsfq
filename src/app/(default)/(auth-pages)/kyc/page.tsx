/** @format */

import KycForm from "@/features/auth/KycForm";
import AuthPageTitle from "../AuthPageTitle";

export default function KYC() {
  return (
    <div className="w-full pt-8 sm:pt-20 xl:px-10 2xl:px-[60px]">
      <AuthPageTitle title="Submit KYC" />
      <KycForm />
    </div>
  );
}
