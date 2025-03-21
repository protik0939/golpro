import dynamic from 'next/dynamic';
import { EmblaOptionsType } from 'embla-carousel';
import { SlickSkeletonLoader, SlickSkeletonLoaderCard, SlickSkeletonLoaderLandscapes, SlickSkeletonLoaderSquare } from '@/components/SkeletonLoader/SlickSkeletonLoader';
import UpBanner from '@/components/UpBanner/UpBanner';

const OPTIONS: EmblaOptionsType = { dragFree: true };
const OPTIONSS: EmblaOptionsType = { loop: true };

const EmbalaCarousel = dynamic(() => import('@/components/EmbalaCarousal/EmbalaCarousel'), {
  ssr: true,
  loading: () => <SlickSkeletonLoader />,
});

const EmbalaCarousalTopTen = dynamic(() => import('@/components/EmbalaCarousalTopTen/EmbalaCarousalTopTen'), {
  ssr: true,
  loading: () => <SlickSkeletonLoaderSquare />,
});

const EmbalaCarouselCard = dynamic(() => import('@/components/EmbalaCarousalCard/EmbalaCarouselCard'), {
  ssr: true,
  loading: () => <SlickSkeletonLoaderCard />,
});

const EmbalaCarousalLandscapes = dynamic(() => import('@/components/EmbalaCarousalLandscapes/EmbalaCarousalLandscapes'), {
  ssr: true,
  loading: () => <SlickSkeletonLoaderLandscapes />,
});

async function fetchData() {
  const res = await fetch(`http://localhost:3000/api/contentcrud/contentget`);
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
}

export default async function Page() {
  const data = await fetchData();
  console.log(data);

  return (
    <div className='w-full'>
      <UpBanner options={OPTIONSS} slidesInfo={data} />
      <EmbalaCarousel title='Hot In Town' options={OPTIONS} slidesInfo={data} />
      <EmbalaCarousalTopTen title='Golpro Top 10' options={OPTIONS} slidesInfo={data} />
      <EmbalaCarouselCard title='Winter Vibes' options={OPTIONS} slidesInfo={data} />
      <EmbalaCarousalLandscapes title='Editors Choices' options={OPTIONS} slidesInfo={data} />
    </div>
  );
}
