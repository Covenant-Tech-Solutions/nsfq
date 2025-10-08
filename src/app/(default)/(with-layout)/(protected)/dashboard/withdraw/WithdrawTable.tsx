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
import { MoneyWavyIcon } from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";

const WithdrawTableSkeleton = dynamic(() => import("./WithdrawTableSkeleton"), {
  ssr: false,
});

const NotFoundTableData = dynamic(
  () => import("@/components/ui/NotFoundTableData"),
  {
    ssr: false,
  },
);

type WithdrawItem = {
  id: number;
  amount: number;
  withdraw_method: {
    name: string;
  };
  status: string;
  created_at: string;
};

type Props = {
  data: WithdrawItem[];
  isLoading: boolean;
};

const WithdrawTable = ({ data, isLoading }: Props) => {
  const { tran } = useTranslations();

  if (isLoading) {
    return <WithdrawTableSkeleton />;
  }

  return (
    <div className="mt-6">
      <h4 className="mb-4 text-lg font-medium">{tran("Withdraw History")}</h4>

      <div className="overflow-hidden rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>{tran("Amount")}</TableHead>
              <TableHead>{tran("Method")}</TableHead>
              <TableHead>{tran("Status")}</TableHead>
              <TableHead>{tran("Date")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow key={item.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>{item?.withdraw_method?.name}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  {new Date(item.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!data?.length && (
          <NotFoundTableData
            icon={MoneyWavyIcon}
            text={tran("No withdraw found")}
          />
        )}
      </div>
    </div>
  );
};

export default WithdrawTable;
