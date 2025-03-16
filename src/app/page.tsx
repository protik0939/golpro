
import dynamic from 'next/dynamic';
import { EmblaOptionsType } from 'embla-carousel'
import { SlickSkeletonLoader, SlickSkeletonLoaderCard, SlickSkeletonLoaderLandscapes, SlickSkeletonLoaderSquare } from '@/components/SkeletonLoader/SlickSkeletonLoader';
import UpBanner from '@/components/UpBanner/UpBanner';
const OPTIONS: EmblaOptionsType = { dragFree: true }
const OPTIONSS: EmblaOptionsType = { loop: true }



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




export default function Page() {
  return (
    <div className='w-full'>

      {/* <SlickSkeletonLoaderSquare /> */}
      <UpBanner options={OPTIONSS} />
      <EmbalaCarousel title='Hot In Town' options={OPTIONS} />
      <EmbalaCarousalTopTen title='Golpro Top 10' options={OPTIONS} />
      <EmbalaCarouselCard title='Winter Vibes' options={OPTIONS} />
      <EmbalaCarousalLandscapes title='Editors Choices' options={OPTIONS} />
    </div>
  );
}