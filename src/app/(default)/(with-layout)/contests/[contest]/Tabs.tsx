/** @format */

"use client";
import { useTranslations } from "@/providers/TranslationProviders";
import { ContestType } from "@/types/contest";
import React, { useState } from "react";
import dynamic from "next/dynamic";
const Participants = dynamic(() => import("./Participants"), { ssr: false });
const Prizes = dynamic(() => import("./Prizes"), { ssr: false });
const Overview = dynamic(() => import("./Overview"), { ssr: false });

type Props = {
  contest: ContestType;
};
const Tabs: React.FC<Props> = ({ contest }) => {
  const { tran } = useTranslations();
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="col-span-12 lg:col-span-8">
      <div className="flex items-center justify-start">
        {["Overview", "Leaderboard", "Prizes"].map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`${index === activeTab ? "border-primary text-primary" : "border-slate-300"} flex-1 border-b-2 py-3 font-medium`}
          >
            {tran(item)}
          </button>
        ))}
      </div>
      {activeTab === 0 && <Overview contest={contest} />}
      {activeTab === 1 && <Participants contest={contest} />}
      {activeTab === 2 && <Prizes contest={contest} />}
    </div>
  );
};

export default Tabs;
