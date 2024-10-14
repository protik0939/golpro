import 'react-loading-skeleton/dist/skeleton.css';

export function SlickSkeletonLoader() {

  // Generate an array of 6 skeleton loaders
  const skeletonLoaders = Array.from({ length: 6 }, (_, index) => (
    <div key={index} className='w-1/6 px-1'>
      <div className={`skeleton w-[1/6] h-full aspect-[270/401] p-2 sm:p-[2px]`} />
    </div>
  ));

  const skeletonLoadersSm = Array.from({ length: 3 }, (_, index) => (
    <div key={index} className='w-1/3 px-1'>
      <div className={`skeleton w-full h-full aspect-[270/401] p-2 sm:p-[2px]`} />
    </div>
  ));

  return (
    <>
      <div className="w-full big:flex flex-wrap justify-between p-0 my-14 hidden">
        {skeletonLoaders}
      </div>
      <div className="w-full sm:flex flex-wrap justify-between p-0 my-14 hidden">
        {skeletonLoadersSm}
      </div>

    </>
  );
}



export function SlickSkeletonLoaderSquare() {

  // Generate an array of 6 skeleton loaders
  const skeletonLoaders = Array.from({ length: 8 }, (_, index) => (
    <div key={index} className='w-[12%] sm:w-1/2 px-1'>
      <div className={`skeleton w-full h-full aspect-square p-2 sm:p-[2px]`} />
    </div>
  ));

  const skeletonLoadersSm = Array.from({ length: 3 }, (_, index) => (
    <div key={index} className='w-1/3 px-1'>
      <div className={`skeleton w-full h-full aspect-square p-2 sm:p-[2px]`} />
    </div>
  ));

  return (
    <>
      <div className="w-full big:flex flex-wrap hidden justify-between p-0 my-14">
        {skeletonLoaders}
      </div>
      <div className="w-full sm:flex flex-wrap hidden justify-between p-0 my-14">
        {skeletonLoadersSm}
      </div>
    </>
  );
}


export function SlickSkeletonLoaderCard() {

  // Generate an array of 6 skeleton loaders
  const skeletonLoaders = Array.from({ length: 5 }, (_, index) => (
    <div key={index} className='w-[20%] sm:w-1/2 px-1'>
      <div className={`skeleton w-full h-full aspect-[135/76] p-2 sm:p-[2px]`} />
    </div>
  ));

  const skeletonLoadersSm = Array.from({ length: 2 }, (_, index) => (
    <div key={index} className='w-1/2 px-1'>
      <div className={`skeleton w-full h-full aspect-[135/76] p-2 sm:p-[2px]`} />
    </div>
  ));

  return (
    <>
      <div className="w-full big:flex flex-wrap hidden justify-between p-0 my-14">
        {skeletonLoaders}
      </div>
      <div className="w-full sm:flex flex-wrap hidden justify-between p-0 my-14">
        {skeletonLoadersSm}
      </div>
    </>
  );
}

export function SlickSkeletonLoaderLandscapes() {

  const skeletonLoaders = Array.from({ length: 3 }, (_, index) => (
    <div key={index} className='w-[33%] sm:w-1/2 px-1'>
      <div className={`skeleton w-full h-full aspect-[1080/517] p-2 sm:p-[2px]`} />
    </div>
  ));

  const skeletonLoadersSm = Array.from({ length: 1 }, (_, index) => (
    <div key={index} className='w-full px-1'>
      <div className={`skeleton w-full h-full aspect-[1080/517] p-2 sm:p-[2px]`} />
    </div>
  ));

  return (
    <>
      <div className="w-full big:flex flex-wrap hidden justify-between p-0 my-14">
        {skeletonLoaders}
      </div>
      <div className="w-full sm:flex flex-wrap hidden justify-between p-0 my-14">
        {skeletonLoadersSm}
      </div>
    </>
  );
}