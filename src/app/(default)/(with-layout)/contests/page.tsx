/** @format */

import { setPageMetaData } from "@/hooks/server/pageSeoSetup";
import QuizBanner from "../quizzes/QuizBanner";
import ContestList from "./ContestList";
export async function generateMetadata() {
  return await setPageMetaData({
    slug: "contests",
  });
}
export default function ContestPage() {
  return (
    <div className="custom-container pt-28">
      <QuizBanner
        title="Join the Ultimate Quiz Battle!"
        subtitle="Test Your Knowledge. Win exciting rewards."
        image="/contest-banner.webp"
        nextContest={true}
      />
      <ContestList />
    </div>
  );
}
