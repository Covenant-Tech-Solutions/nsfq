/** @format */
import React, { Suspense, use } from "react";
import Loader from "@/components/ui/Loader";
import QuizDetails from "./Details";
import { setPageMetaData } from "@/hooks/server/pageSeoSetup";
type Params = Promise<{ quiz: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { quiz } = await params;
  return await setPageMetaData({
    type: "quiz",
    slug: quiz,
  });
}

const DetailPage = ({ params }: { params: Params }) => {
  const { quiz } = use(params);
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <QuizDetails quiz={quiz} />
      </Suspense>
    </div>
  );
};

export default DetailPage;
