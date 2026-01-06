const Loading = () => {
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <div className="h-fit bg-gradient-to-b from-purple-800 p-6">
        <div className="flex flex-col md:flex-row items-center gap-x-5">
          <div className="relative h-32 w-32 lg:h-44 lg:w-44 rounded-md bg-neutral-800/50 animate-pulse" />
          <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
            <div className="h-4 w-20 bg-neutral-800/50 animate-pulse rounded" />
            <div className="h-12 w-64 bg-neutral-800/50 animate-pulse rounded" />
            <div className="h-4 w-48 bg-neutral-800/50 animate-pulse rounded" />
          </div>
        </div>
      </div>
      <div className="mt-6 px-6 space-y-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-x-4">
            <div className="h-12 w-12 rounded-md bg-neutral-800/50 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-neutral-800/50 animate-pulse rounded" />
              <div className="h-3 w-32 bg-neutral-800/50 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
