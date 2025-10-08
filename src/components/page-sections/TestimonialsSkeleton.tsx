const TestimonialsSkeleton = () => {
  return (
    <section className="stp-30 sbp-30 relative overflow-hidden bg-slate-50">
      <div className="bg-secondary/30 absolute -bottom-10 left-0 size-[480px] rounded-full blur-[200px] xl:-left-52"></div>
      <div className="absolute right-0 -bottom-10 size-[480px] rounded-full bg-yellow-100 blur-[200px] xl:-right-20"></div>
      <div className="absolute bottom-0 left-0 z-10 h-40 w-40 animate-pulse rounded-md bg-gray-200" />

      <div className="custom-container">
        {/* Header Section */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex max-w-[526px] flex-col items-start justify-start">
            <div className="h-8 w-3/4 animate-pulse rounded-md bg-gray-200"></div>
            <div className="mt-3 h-4 w-full animate-pulse rounded-md bg-gray-200"></div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xl max-[400px]:hidden">
            <div className="size-12 animate-pulse rounded-full border border-gray-300"></div>
            <div className="size-12 animate-pulse rounded-full border border-gray-300"></div>
          </div>
        </div>

        {/* Swiper Skeleton */}
        <div className="stp-15 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="relative flex animate-pulse flex-col items-center justify-center gap-3 overflow-hidden rounded-md border-b-2 border-transparent bg-slate-50/50 p-8"
            >
              <div className="absolute top-10 -left-16 size-[92px] bg-yellow-300/30 blur-[120px]"></div>
              <div className="absolute -right-16 -bottom-10 size-[92px] bg-blue-300/30 blur-[120px]"></div>

              <div className="flex size-[60px] items-center justify-center overflow-hidden rounded-full bg-gray-200"></div>
              <div className="h-5 w-1/2 rounded-md bg-gray-200"></div>
              <div className="h-3 w-3/4 rounded-md bg-gray-200"></div>
              <div className="mt-4 h-16 w-full rounded-md bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSkeleton;
