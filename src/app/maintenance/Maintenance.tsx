"use client";

import Countdown from "@/components/ui/Countdown";
import Loader from "@/components/ui/Loader";
import { API_BASE_URL, MAINTENANCE, SERVER_URL } from "@/configs";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { useEffect, useState } from "react";
import maintenanceImage from "../../../public/maintenance.png";

interface MaintenanceData {
  description: string;
  countdown: string;
  image: string;
}

const Maintenance = () => {
  const maintenanceMode = Cookies.get(MAINTENANCE);
  const [maintenanceData, setMaintenanceData] =
    useState<MaintenanceData | null>(null);

  const getMaintenanceData = async () => {
    try {
      await axios.get(`${API_BASE_URL}/api/v1/info`);
      Cookies.remove(MAINTENANCE);
    } catch (err: any) {
      const data = err?.response?.data?.data;
      if (data) {
        setMaintenanceData(data);
      } else {
        console.error("Failed to fetch maintenance data:", err);
      }
    }
  };

  useEffect(() => {
    if (!maintenanceMode) {
      Cookies.set(MAINTENANCE, "true");
    }

    getMaintenanceData();
    const interval = setInterval(getMaintenanceData, 30000);
    return () => clearInterval(interval);
  }, [maintenanceMode]);

  if (!maintenanceData) {
    return <Loader />;
  }
  return (
    <div className="relative h-screen w-full">
      <Image
        src={
          maintenanceData?.image
            ? `${SERVER_URL}${maintenanceData?.image}`
            : maintenanceImage
        }
        alt="maintenance"
        width={1920}
        height={1080}
        className="h-full w-full object-fill"
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="mb-4 text-2xl font-semibold">
          {maintenanceData.description}
        </p>
        <Countdown dateTime={maintenanceData.countdown} />
      </div>
    </div>
  );
};

export default Maintenance;
