/** @format */

import { setPageMetaData } from "@/hooks/server/pageSeoSetup";
import QuizBanner from "./QuizBanner";
import QuizList from "./QuizList";
export async function generateMetadata() {
  return await setPageMetaData({
    slug: "quizzes",
  });
}
export default function QuizzesPage() {
  return (
    <div className="custom-container pt-28">
      <QuizBanner
        title="Test Your Knowledge"
        subtitle="Dominate the Quiz World!"
      />
      <QuizList />
    </div>
  );
}
