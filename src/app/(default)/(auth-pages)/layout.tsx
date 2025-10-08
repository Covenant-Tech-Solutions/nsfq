/** @format */

import ErrorBoundary from "@/components/HOC/ErrorBoundary";
import Error from "@/components/ui/error";
import Logo from "@/components/ui/Logo";
import RightBar from "./RightBar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-screen items-center justify-center overflow-auto px-6 py-6">
      <div className="bg-dark4 border-dark5/40 grid min-h-[800px] w-full max-w-[1350px] overflow-auto rounded-xl border lg:grid-cols-2">
        <div className="relative z-30 flex w-full flex-1 flex-col items-start justify-start bg-white p-6 sm:p-10 sm:px-10">
          <Logo />
          <ErrorBoundary fallback={<Error />}>{children}</ErrorBoundary>
        </div>
        <RightBar />
      </div>
    </div>
  );
}
