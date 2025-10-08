/** @format */

import { useTranslations } from "@/providers/TranslationProviders";
import { ContestType } from "@/types/contest";
import React from "react";
type Params = {
  contest: ContestType;
};
const Overview: React.FC<Params> = ({ contest }) => {
  const { tran } = useTranslations();
  return (
    <div className="pt-8">
      <h5 className="heading-5">{tran("Description")}</h5>
      <p className="text-light4">{contest?.translation?.description}</p>
    </div>
  );
};

export default Overview;
