/** @format */
"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { AppInfoType } from "@/types";
import { ContestType } from "@/types/contest";
import { cn } from "@/utils/cn";
import {
  CoinIcon,
  CoinsIcon,
  CrownCrossIcon,
  CrownIcon,
  CrownSimpleIcon,
  TrophyIcon,
} from "@phosphor-icons/react/dist/ssr";
import React, { useMemo } from "react";

type Params = {
  contest: ContestType;
};
const Prizes: React.FC<Params> = ({ contest }) => {
  const { tran } = useTranslations();
  const { appInfo }: { appInfo: AppInfoType } = useAuthStore((state) => state);
  const firstTreePrizes = useMemo(() => {
    return contest?.prizes?.sort((a, b) => a?.rank - b?.rank)?.slice(0, 3);
  }, [contest]);

  const restPrizes = useMemo(() => {
    return contest?.prizes?.sort((a, b) => a?.rank - b?.rank)?.slice(3);
  }, [contest]);
  return (
    <div className="pt-8">
      <div className="">
        <div className="overflow-hidden rounded-xl font-medium">
          <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 md:grid-cols-3">
            {firstTreePrizes?.map((prize) => (
              <div
                key={prize?.id}
                className={cn(
                  "border-primary/30 bg-primary/10 w-full max-w-md rounded-2xl border p-6 transition-shadow duration-300 hover:shadow-lg sm:my-2",
                )}
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={cn(
                      "rounded-full p-3 text-3xl text-white",
                      prize?.rank === 1
                        ? "bg-primary"
                        : prize?.rank === 2
                          ? "bg-secondary"
                          : prize?.rank === 3
                            ? "bg-danger"
                            : "bg-secondary/20 text-dark5",
                    )}
                  >
                    {prize?.rank === 1 ? (
                      <CrownCrossIcon className="" />
                    ) : prize?.rank === 2 ? (
                      <CrownIcon />
                    ) : prize?.rank === 3 ? (
                      <CrownSimpleIcon />
                    ) : (
                      <CoinsIcon />
                    )}
                  </div>
                  <h3
                    className={cn(
                      "rounded-full px-5 py-1 text-xl font-semibold text-white",
                      prize?.rank === 1
                        ? "bg-primary"
                        : prize?.rank === 2
                          ? "bg-secondary"
                          : prize?.rank === 3
                            ? "bg-danger"
                            : "bg-secondary/10",
                    )}
                  >
                    {prize?.rank}
                    {prize?.rank === 1
                      ? "st"
                      : prize?.rank === 2
                        ? "nd"
                        : prize?.rank === 3
                          ? "rd"
                          : "th"}{" "}
                    {tran("Prize")}
                  </h3>
                </div>

                <div className="flex flex-col items-center justify-center gap-2 pt-5">
                  <p className="text-primary dark:text-primary text-3xl font-bold">
                    {Number(prize?.amount)} {tran("Coins")}
                  </p>
                  <p className="bg-primary/10 flex items-center gap-2 rounded-full px-3 py-1 text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      {Number(prize?.amount) *
                        appInfo?.application_info?.coins?.score_ratio?.score}
                    </span>
                    <span>{tran("XP")}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          {restPrizes?.length ? (
            <Table className="mt-6 overflow-hidden rounded-xl font-medium">
              <TableHeader className="bg-primary/10">
                <TableRow>
                  <TableHead className="w-20">{tran("Rank")}</TableHead>
                  <TableHead className="flex-1">{tran("Prize")}</TableHead>
                  <TableHead className="flex-1">{tran("Xp")}</TableHead>
                  <TableHead className="flex-1">{tran("Coins")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restPrizes?.map((prize) => (
                  <TableRow key={prize?.id} className="">
                    <TableCell className="w-20">
                      {" "}
                      <div className="flex items-center gap-1">
                        <TrophyIcon className="text-secondary text-lg" />{" "}
                        {prize?.rank}
                      </div>
                    </TableCell>

                    <TableCell className="flex-1 text-slate-500">
                      {prize?.name}
                    </TableCell>
                    <TableCell className="flex-1">
                      +
                      {Number(prize?.amount) *
                        appInfo?.application_info?.coins?.score_ratio
                          .score}{" "}
                      <span className="text-slate-500">xp</span>
                    </TableCell>
                    <TableCell className="flex flex-1 items-center justify-start gap-2">
                      <CoinIcon className="text-yellow-500" />{" "}
                      {Number(prize?.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Prizes;
