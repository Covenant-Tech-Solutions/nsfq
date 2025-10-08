/** @format */

import Footer from "@/components/partials/Footer";
import Header from "@/components/partials/header/Header";
import ErrorBoundary from "@/components/HOC/ErrorBoundary";
import Error from "@/components/ui/error";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={<Error />}>
      <Header />
      {children}
      <Footer />
    </ErrorBoundary>
  );
}
