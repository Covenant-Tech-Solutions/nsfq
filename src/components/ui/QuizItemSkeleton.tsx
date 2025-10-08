/** @format */

type Props = {
  total?: number;

  className?: string;
};

export default function Skeleton({
  total = 3,

  className,
}: Readonly<Props>) {
  const gridClass = className || `grid grid-cols-12 gap-6 pt-8`;

  return (
    <div className={gridClass}>
      {Array.from({ length: total }, (_, index) => (
        <div
          key={index}
          className={`border-primary/20 relative col-span-12 animate-pulse overflow-hidden rounded-xl border p-2 md:col-span-6 lg:col-span-4`}
        >
          <div className="relative overflow-hidden rounded-xl">
            <div className="h-[220px] w-full bg-gray-300" />
            <div className="absolute inset-0 z-20 flex flex-col justify-between p-4">
              <div className="flex items-center justify-between">
                <div className="h-6 w-16 rounded-full bg-gray-400" />
                <div className="h-6 w-20 rounded-full bg-gray-400" />
              </div>
              <div className="flex justify-end">
                <div className="h-8 w-8 rounded-full bg-gray-400" />
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-start justify-start p-4">
            <div className="flex w-full items-center justify-start gap-3 text-sm text-slate-600">
              <div className="h-4 w-16 rounded-md bg-gray-300" />
              <div className="h-4 w-16 rounded-md bg-gray-300" />
              <div className="h-4 w-16 rounded-md bg-gray-300" />
            </div>

            <div className="mt-4 h-6 w-3/4 rounded-md bg-gray-300" />

            <div className="flex w-full gap-2 pt-4 pb-6">
              <div className="h-10 w-1/2 rounded-md bg-gray-200" />
              <div className="h-10 w-1/2 rounded-md bg-gray-200" />
            </div>

            <div className="flex w-full items-center justify-between gap-3">
              <div className="h-10 w-1/2 rounded-md bg-gray-300" />
              <div className="h-10 w-1/2 rounded-md bg-gray-300" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
