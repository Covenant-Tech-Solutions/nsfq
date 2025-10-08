import { cn } from "@/utils/cn";

export default function CategoriesSkeleton() {
  return (
    <ul className="flex flex-wrap items-center justify-start gap-3 pt-6 font-medium">
      {/* First "All" skeleton */}
      <li
        className={cn(
          "flex animate-pulse items-center justify-start gap-1 rounded-md bg-gray-200 px-2 py-1",
          "cursor-default",
        )}
      >
        <div className="h-5 w-5 rounded-full bg-gray-300" />
        <div className="h-4 w-10 rounded bg-gray-300" />
      </li>

      {/* First 9 categories skeleton */}
      {Array.from({ length: 9 }).map((_, idx) => (
        <li
          key={`skeleton-category-${idx}`}
          className="flex animate-pulse items-center justify-start gap-1 rounded-md bg-gray-200 px-2 py-1"
        >
          <div className="h-5 w-5 rounded-full bg-gray-300" />
          <div className="h-4 w-16 rounded bg-gray-300" />
        </li>
      ))}

      {/* Dots menu skeleton */}
      <li className="flex animate-pulse items-center justify-center rounded-md bg-gray-200 p-2">
        <div className="h-5 w-5 rounded-full bg-gray-300" />
      </li>
    </ul>
  );
}
