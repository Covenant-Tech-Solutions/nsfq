const QuestionLoader = () => {
  return (
    <div className="w-full animate-pulse space-y-6">
      {/* Question title */}
      <div className="mx-auto h-10 w-2/3 rounded bg-gray-300"></div>

      <div className="grid grid-cols-12 gap-8">
        {/* Image placeholder */}
        <div className="col-span-12 h-64 w-full rounded bg-gray-300 lg:col-span-7"></div>

        {/* Options */}
        <div className="col-span-12 space-y-4 lg:col-span-5">
          {[1, 2, 3, 4].map((_, idx) => (
            <div key={idx} className="h-14 w-full rounded bg-gray-300"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionLoader;
