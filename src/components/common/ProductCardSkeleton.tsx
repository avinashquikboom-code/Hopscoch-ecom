export function ProductCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[4/5] bg-muted/30" />
      
      {/* Content Skeleton */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        <div className="space-y-2">
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </div>
        
        {/* Rating Skeleton */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-muted rounded-full" />
            ))}
          </div>
          <div className="h-3 w-8 bg-muted rounded" />
        </div>
        
        {/* Price + Button Skeleton */}
        <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-border/60">
          <div className="flex flex-col gap-1">
            <div className="h-5 w-16 bg-muted rounded" />
            <div className="h-3 w-12 bg-muted rounded" />
          </div>
          <div className="h-8 w-16 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  );
}
