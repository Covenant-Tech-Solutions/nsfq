/** @format */

import { Protected } from "@/components/HOC/Protected";
import ErrorBoundary from "@/components/HOC/ErrorBoundary";
import Error from "@/components/ui/error";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={<Error />}>
      <Protected>{children}</Protected>
    </ErrorBoundary>
  );
}
