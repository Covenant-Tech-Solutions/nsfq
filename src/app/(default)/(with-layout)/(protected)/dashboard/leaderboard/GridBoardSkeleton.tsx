/** @format */

const GridBoardSkeleton = () => {
  return (
    <div className="grid gap-4 pt-6 sm:grid-cols-2 md:grid-cols-3">
      {/* First Place Card */}
      <div className="bg-primary/10 flex flex-col items-start justify-start rounded-xl p-6">
        <div className="flex items-center justify-start gap-3">
          <div className="text-2xl text-yellow-500">👑</div>
          <p className="text-2xl font-medium">#1</p>
        </div>

        <div className="flex items-center justify-start gap-3 pt-4">
          <div className="rounded-full bg-gray-200 p-1">
            <div className="h-[50px] w-[50px] rounded-full bg-gray-300" />
          </div>
          <div className="">
            <div className="mb-1 h-6 w-32 rounded bg-gray-200"></div>
            <div className="h-4 w-24 rounded bg-gray-100"></div>
          </div>
        </div>

        <div className="pt-6">
          <div className="h-7 w-20 rounded bg-gray-200"></div>
          <div className="flex items-center justify-start gap-4 pt-1 text-slate-500">
            <div className="h-4 w-24 rounded bg-gray-100"></div>
            <div className="h-4 w-20 rounded bg-gray-100"></div>
          </div>
        </div>
      </div>

      {/* Second Place Card */}
      <div className="bg-primary/10 flex flex-col items-start justify-start rounded-xl p-6">
        <div className="flex items-center justify-start gap-3">
          <div className="text-2xl text-gray-400">🥈</div>
          <p className="text-2xl font-medium">#2</p>
        </div>

        <div className="flex items-center justify-start gap-3 pt-4">
          <div className="rounded-full bg-gray-200 p-1">
            <div className="h-[50px] w-[50px] rounded-full bg-gray-300" />
          </div>
          <div className="">
            <div className="mb-1 h-6 w-32 rounded bg-gray-200"></div>
            <div className="h-4 w-24 rounded bg-gray-100"></div>
          </div>
        </div>

        <div className="pt-6">
          <div className="h-7 w-20 rounded bg-gray-200"></div>
          <div className="flex items-center justify-start gap-4 pt-1 text-slate-500">
            <div className="h-4 w-24 rounded bg-gray-100"></div>
            <div className="h-4 w-20 rounded bg-gray-100"></div>
          </div>
        </div>
      </div>

      {/* Third Place Card */}
      <div className="bg-primary/10 flex flex-col items-start justify-start rounded-xl p-6">
        <div className="flex items-center justify-start gap-3">
          <div className="text-2xl text-amber-600">🥉</div>
          <p className="text-2xl font-medium">#3</p>
        </div>

        <div className="flex items-center justify-start gap-3 pt-4">
          <div className="rounded-full bg-gray-200 p-1">
            <div className="h-[50px] w-[50px] rounded-full bg-gray-300" />
          </div>
          <div className="">
            <div className="mb-1 h-6 w-32 rounded bg-gray-200"></div>
            <div className="h-4 w-24 rounded bg-gray-100"></div>
          </div>
        </div>

        <div className="pt-6">
          <div className="h-7 w-20 rounded bg-gray-200"></div>
          <div className="flex items-center justify-start gap-4 pt-1 text-slate-500">
            <div className="h-4 w-24 rounded bg-gray-100"></div>
            <div className="h-4 w-20 rounded bg-gray-100"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridBoardSkeleton;
