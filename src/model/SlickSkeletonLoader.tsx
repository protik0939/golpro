// components/SkeletonLoader.tsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Ensure CSS for skeletons is imported

export default function SlickSkeletonLoader() {
  // Generate an array of 6 skeleton loaders
  const skeletonLoaders = Array.from({ length: 6 }, (_, index) => (
    <div key={index} className="flex flex-col items-center gap-2 w-1/6"> {/* Each div occupies 1/6 of the width */}
      <div className="skeleton w-full h-full" style={{ aspectRatio: '270 / 401', borderRadius: '.75rem' }}></div>
      <Skeleton height={'10%'} width={'15%'} /> {/* Added height for visibility */}
      <Skeleton height={'10%'} width={'15%'} /> {/* Added height for visibility */}
    </div>
  ));

  return (
    <div className="w-full flex flex-wrap justify-between gap-2 p-0"> {/* Remove padding to eliminate side gaps */}
      {skeletonLoaders}
    </div>
  );
}
