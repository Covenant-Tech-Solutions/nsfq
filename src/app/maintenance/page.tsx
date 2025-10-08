import Loader from "@/components/ui/Loader";
import { Suspense } from "react";
import Maintenance from "./Maintenance";

const MaintenancePage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Maintenance />
    </Suspense>
  );
};

export default MaintenancePage;
