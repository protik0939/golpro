import SlickSkeletonLoader from '@/model/SlickSkeletonLoader';
import dynamic from 'next/dynamic';
import { EmblaOptionsType } from 'embla-carousel'

const OPTIONS: EmblaOptionsType = { dragFree: true }

// Dynamically loaded components with skeleton loaders
const TopBanner = dynamic(() => import('@/components/TopBanner'), {
  loading: () => <SlickSkeletonLoader />,
});

const EmbalaCarousel = dynamic(() => import('@/components/EmbalaCarousal/EmbalaCarousel'));

const EmbalaCarouselCard = dynamic(() => import('@/components/EmbalaCarousalCard/EmbalaCarouselCard'), {
  ssr: false,
  loading: () => <SlickSkeletonLoader />,
});

const SlickTopTen = dynamic(() => import('@/components/SlickTopTen'), {
  ssr: false,
  loading: () => <SlickSkeletonLoader />,
});

const SlickCarousalLandScapes = dynamic(() => import('@/components/SlickCarousalLandScapes'), {
  ssr: false,
  loading: () => <SlickSkeletonLoader />,
});

const SlickCarousalCards = dynamic(() => import('@/components/SlickCarousalCards'), {
  ssr: false,
  loading: () => <SlickSkeletonLoader />,
});

export default function Page() {
  return (
    <div className='w-full'>
      <TopBanner />
      <EmbalaCarousel options={OPTIONS} />
      <EmbalaCarouselCard options={OPTIONS} />
      <SlickCarousalCards />
      <SlickTopTen />
      <SlickCarousalLandScapes />
    </div>
  );
}
