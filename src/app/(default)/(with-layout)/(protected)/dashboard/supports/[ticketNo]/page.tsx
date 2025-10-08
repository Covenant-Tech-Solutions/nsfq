/** @format */

import React, { Suspense } from "react";
import Loader from "@/components/ui/Loader";
import TicketDetails from "./Details";
type Props = {
  params: Promise<{ ticketNo: string }>;
};
const page = async ({ params }: Props) => {
  const { ticketNo } = await params;
  return (
    <Suspense fallback={<Loader />}>
      <TicketDetails ticketNumber={ticketNo} />
    </Suspense>
  );
};

export default page;
