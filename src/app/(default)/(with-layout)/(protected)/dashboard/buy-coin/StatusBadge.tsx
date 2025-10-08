/** @format */

interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
