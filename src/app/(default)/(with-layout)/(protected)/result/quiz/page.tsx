/** @format */

import Loader from "@/components/ui/Loader";

import { Suspense } from "react";
import { PageResolved } from "./PageResolved";

export default function QuizResultPage() {
  return (
    <Suspense fallback={<Loader />}>
      <PageResolved />
    </Suspense>
  );
}
