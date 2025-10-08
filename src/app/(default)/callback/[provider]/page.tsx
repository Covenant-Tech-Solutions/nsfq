/** @format */
import dynamic from "next/dynamic";
import { Suspense } from "react";
import OauthLogin from "./OauthLogin";

const Loader = dynamic(() => import("@/components/ui/Loader"));
type Params = Promise<{ provider: string }>;
const page = async ({ params }: { params: Params }) => {
  const { provider } = await params;
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <OauthLogin provider={provider} />
      </Suspense>
    </div>
  );
};

export default page;
