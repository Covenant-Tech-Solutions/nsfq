/** @format */

import { useTranslations } from "@/providers/TranslationProviders";

export default function LeaderBoardTableSkeleton() {
  const rows = Array.from({ length: 5 });

  const { tran } = useTranslations();

  return (
    <div className="mt-6 animate-pulse overflow-hidden rounded-lg bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              {tran("Rank")}
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              {tran("Player")}
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              {tran("Stats")}
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              {tran("XP")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((_, i) => (
            <tr key={i}>
              {Array.from({ length: 4 }).map((_, j) => (
                <td key={j} className="px-4 py-4">
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
