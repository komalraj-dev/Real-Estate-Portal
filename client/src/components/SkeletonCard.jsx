const SkeletonCard = () => (
  <div className="bg-stone-card border border-stone-line rounded-sm overflow-hidden animate-pulse">
    <div className="h-56 bg-stone-line" />
    <div className="p-5 space-y-3">
      <div className="h-4 w-1/3 bg-stone-line rounded" />
      <div className="h-5 w-2/3 bg-stone-line rounded" />
      <div className="h-4 w-1/2 bg-stone-line rounded" />
    </div>
  </div>
);

export default SkeletonCard;
