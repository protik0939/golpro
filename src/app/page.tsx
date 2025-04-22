import dynamic from 'next/dynamic';
import { EmblaOptionsType } from 'embla-carousel';
import { SlickSkeletonLoader, SlickSkeletonLoaderCard, SlickSkeletonLoaderLandscapes, SlickSkeletonLoaderSquare } from '@/components/SkeletonLoader/SlickSkeletonLoader';
import UpBanner from '@/components/UpBanner/UpBanner';
import { connectDB } from './lib/mongodb';
import Content from './models/Content';
import { IContent } from './models/types';

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
  const upBannerData = data.filter((item: IContent) => item.cHomePage?.includes('upbanner')).reverse();
  const currentMonthData = data.filter((item: IContent) => item.cHomePage?.includes('eidvibe')).reverse();
  const editorsChoiceData = data.filter((item: IContent) => item.cHomePage?.includes('editorschoice')).reverse();
  const topUserVisitData = data
    .filter((item: IContent) => typeof item.cUserVisit === 'number') // Ensure cUserVisit is a number
    .sort((a: IContent, b: IContent) => (b.cUserVisit ?? 0) - (a.cUserVisit ?? 0)) // Sort descending
    .slice(0, 10);
  const recentContents = data
    .filter((item: IContent) => item.createdAt) // Ensure createdAt exists
    .sort((a: IContent, b: IContent) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 12);

  const rommanceData = data.filter((item: IContent) => item.cHomePage?.includes('romancetime')).reverse();
  const funData = data.filter((item: IContent) => item.cHomePage?.includes('funtime')).reverse();
  const horrorData = data.filter((item: IContent) => item.cHomePage?.includes('horror')).reverse();

  const dramaticMonths: { [key: number]: string } = {
    0: "Whispers of January",
    1: "Frozen Veil February",
    2: "Echoes of March",
    3: "Slumbering April",
    4: "Bloomchant May",
    5: "Infernal June",
    6: "Solarborn July",
    7: "Dusktide August",
    8: "Fableseek September",
    9: "Twilighted October",
    10: "Ashenfall November",
    11: "Starlaced December",
  };
  
  const currentMonth = new Date().getMonth();
  const dramaticName = dramaticMonths[currentMonth];


  return (
    <div className='w-full'>
      <UpBanner options={OPTIONSS} slidesInfo={upBannerData} />
      <EmbalaCarousel title='Hot In Town' options={OPTIONS} slidesInfo={recentContents} />
      <EmbalaCarouselCard title={dramaticName} options={OPTIONS} slidesInfo={currentMonthData} />
      <EmbalaCarousalTopTen title='Golpro Top 10' options={OPTIONS} slidesInfo={topUserVisitData} />
      <EmbalaCarousel title='Have a Rommance' options={OPTIONS} slidesInfo={rommanceData} />
      <EmbalaCarouselCard title='Laugh Out Loud' options={OPTIONS} slidesInfo={funData} />
      <EmbalaCarousel title='Haunted Horror' options={OPTIONS} slidesInfo={horrorData} />
      <EmbalaCarousalLandscapes title='Editors Choices' options={OPTIONS} slidesInfo={editorsChoiceData} />
    </div>
  );
}
