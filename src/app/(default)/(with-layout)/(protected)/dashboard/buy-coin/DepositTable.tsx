/** @format */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "@/providers/TranslationProviders";
import { CoinsIcon } from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";
import DepositTableSkeleton from "./DepositTableSkeleton";
import StatusBadge from "./StatusBadge";
import moment from "moment";

const NotFoundTableData = dynamic(
  () => import("@/components/ui/NotFoundTableData"),
  {
    ssr: false,
  },
);

interface DepositTableProps {
  deposits: any;
  isLoading: boolean;
}

export default function DepositTable({
  deposits,
  isLoading,
}: DepositTableProps) {
  const { tran } = useTranslations();

  if (isLoading) {
    return <DepositTableSkeleton />;
  }

  return (
    <div className="mt-6">
      <h4 className="mb-4 text-lg font-medium">{tran("Buy History")}</h4>
      <div className="overflow-hidden rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{tran("Track ID")}</TableHead>
              <TableHead>{tran("Amount")}</TableHead>
              <TableHead>{tran("Charge")}</TableHead>
              <TableHead>{tran("Total Coins")}</TableHead>
              <TableHead>{tran("Status")}</TableHead>
              <TableHead>{tran("Date")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deposits?.map((deposit: any) => (
              <TableRow key={deposit.id}>
                <TableCell className="font-mono text-sm">
                  {deposit.track}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{deposit.amount}</span>
                    <span className="text-sm text-slate-500">
                      {deposit.currency}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-red-600">
                    +{deposit.charge} {deposit.currency}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{deposit?.coins || 0}</span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={deposit.status} />
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                  {moment(deposit.created_at).format("DD-MM-YYYY hh:mm A")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!deposits?.length && (
          <NotFoundTableData
            icon={CoinsIcon}
            text={tran("No deposits found")}
          />
        )}
      </div>
    </div>
  );
}
