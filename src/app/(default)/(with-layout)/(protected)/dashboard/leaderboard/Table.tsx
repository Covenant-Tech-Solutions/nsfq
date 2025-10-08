/** @format */

import ImageLoader from "@/components/ui/ImageLoader";
import NotFoundTableData from "@/components/ui/NotFoundTableData";
import {
  Table as CustomTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LeaderBoardTableSkeleton from "./LeaderBoardTableSkeleton";
import { CrownCrossIcon } from "@phosphor-icons/react/dist/ssr";

const Table = ({
  leaderboards,
  tran,
  isLoading,
}: {
  leaderboards: any;
  tran: any;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return <LeaderBoardTableSkeleton />;
  }
  return (
    <div className="mt-6 overflow-hidden rounded-lg bg-white">
      <CustomTable>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">{tran("Rank")}</TableHead>
            <TableHead className="flex-1">{tran("Player")}</TableHead>
            <TableHead className="flex-1">{tran("Stats")}</TableHead>
            <TableHead className="flex-1">{tran("XP")}</TableHead>
          </TableRow>
        </TableHeader>
        {leaderboards?.map((item: any, idx: number) => (
          <TableBody key={item?.id}>
            <TableRow>
              <TableCell>#{idx + 1}</TableCell>
              <TableCell className="flex items-center gap-2">
                <ImageLoader
                  src={item?.avatar}
                  alt={item?.full_name}
                  user={item}
                  width={24}
                  height={24}
                  className="size-6 shrink-0 rounded-full"
                />
                <p className="font-medium">{item?.full_name}</p>
              </TableCell>
              <TableCell className="flex-1 text-slate-500">
                {item?.quizzes_count} {tran("Quizzes")} -{" "}
                {Number(item?.quizzes_avg_score ?? 0).toFixed(2)}% {tran("Avg")}
              </TableCell>
              <TableCell className="flex-1">{item?.score}</TableCell>
            </TableRow>
          </TableBody>
        ))}
      </CustomTable>

      {!leaderboards?.length && (
        <NotFoundTableData icon={CrownCrossIcon} text="No users found" />
      )}
    </div>
  );
};

export default Table;
