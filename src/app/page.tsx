import dynamic from 'next/dynamic';
import { EmblaOptionsType } from 'embla-carousel';
import { SlickSkeletonLoader, SlickSkeletonLoaderCard, SlickSkeletonLoaderLandscapes, SlickSkeletonLoaderSquare } from '@/components/SkeletonLoader/SlickSkeletonLoader';
import UpBanner from '@/components/UpBanner/UpBanner';
import { connectDB } from './lib/mongodb';
import Content from './models/Content';

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
  await connectDB();
  const data = await Content.find({}).lean();
  return JSON.parse(JSON.stringify(data));
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
