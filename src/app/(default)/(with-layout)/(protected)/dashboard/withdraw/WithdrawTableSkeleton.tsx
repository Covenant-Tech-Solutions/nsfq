/** @format */

export default function WithdrawTableSkeleton() {
  const rows = Array.from({ length: 5 });

  return (
    <div className="mt-6 animate-pulse overflow-hidden rounded-lg bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              #
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              Amount
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              Method
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((_, i) => (
            <tr key={i}>
              {Array.from({ length: 5 }).map((_, j) => (
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
