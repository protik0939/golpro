'use client'
import React, { useEffect, useState } from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from '../EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import './UpBanner.css'
import Link from 'next/link'
import Image from 'next/image'
import { MdBookmarkAdded, MdOutlineBookmarkAdd } from 'react-icons/md'
import Autoplay from 'embla-carousel-autoplay'
import toBase64 from '../ToBasesf'
import shimmer from '../Shimmer'
import { IContent } from '@/app/models/types'
import { PiHeadphonesFill } from 'react-icons/pi'
import { BiSolidMoviePlay } from 'react-icons/bi'
import { FaBookReader } from 'react-icons/fa'
import { useBookmark } from '@/app/context/BookMarkContext'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useShare } from '@/app/context/ShareContext'
import { IoShareSocialOutline } from 'react-icons/io5'



type PropType = {
    options?: EmblaOptionsType
    slidesInfo?: IContent[]
}

const UpBanner: React.FC<PropType> = (props) => {
    const { options, slidesInfo } = props;
    const { toggleBookmark, isBookmarked } = useBookmark();
    const { data } = useSession();
    const router = useRouter();
        const { handleShareClick } = useShare();

    const [emblaRef, emblaApi] = useEmblaCarousel(options, [
        Autoplay({ delay: 5000, stopOnInteraction: false })
    ])

    const [visibleSlideIndex, setVisibleSlideIndex] = useState<number>(0)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    useEffect(() => {
        if (!emblaApi) return; // If there's no emblaApi, return early 
        const onSelect = () => {
            const selectedIndex = emblaApi.selectedScrollSnap();
            setVisibleSlideIndex(selectedIndex);
        };
        // Set up the event listener
        emblaApi.on('select', onSelect);
        // Return a cleanup function to remove the listener when the effect runs again or the component unmounts
        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi]);


    const getInteractIcon = (interactType: string) => {
        switch (interactType) {
            case 'audiostory':
                return <PiHeadphonesFill />;
            case 'Watch':
                return <BiSolidMoviePlay />;
            case 'storyseries':
                return <FaBookReader />;
            case 'story':
                return <FaBookReader />;
            default:
                return null;
        }
    };

    return (
        <section className="embla_Upbanner">
            <div className="embla__viewport_Upbanner" ref={emblaRef}>
                <div className="embla__container_Upbanner">
                    {
                        slidesInfo?.map((content: IContent, index: number) => {

                            const logoClass = index === visibleSlideIndex ? 'fade-in' : 'fade-out'

                            return (
                                <div key={content.cTitle} className={`relative flex justify-center items-center embla__slide_Upbanner`}>
                                    <Link href={`${content.cLink}`} className="relative">
                                        <div className="w-full h-auto relative -z-20">
                                            <Image
                                                unoptimized={true}
                                                src={content.cPortrait}
                                                alt="Responsive Image"
                                                width={1094}
                                                height={1625}
                                                className="block md:hidden object-cover"
                                                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1094, 1625))}`}
                                            />

                                            <Image
                                                unoptimized={true}
                                                src={content.cLandscape}
                                                alt="Responsive Image"
                                                width={2375}
                                                height={1137}
                                                className="hidden md:block lg:hidden object-cover"
                                                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(2375, 1137))}`}
                                            />

                                            <Image
                                                unoptimized={true}
                                                src={content.cBanner}
                                                alt="Responsive Image"
                                                width={2375}
                                                height={825}
                                                className="hidden lg:block object-cover"
                                                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(2375, 825))}`}
                                            />

                                        </div>
                                    </Link>

                                    <div className="w-full md:w-1/2 p-2 md:p-5 lg:p-8 absolute h-fill right-0 bottom-0 sm:bottom-0 flex flex-col items-center md:items-end justify-center md:justify-end md:h-full h-1/2 carousal-bg z-2">
                                        <Link href={`${content.cLink}`} className="right-0 bottom-0 sm:bottom-0 flex flex-col items-center md:items-end md:justify-end">
                                            <Image
                                                unoptimized={true}
                                                src={content.cLogo}
                                                alt="Logo Image"
                                                width='200'
                                                height='200'
                                                className={`!w-1/3 lg:!w-1/4 object-cover ${logoClass}`} // Add the animation class here
                                                loading='eager'
                                            />
                                            <h1 className="text-secondary md:text-right text-center text-base mt-4 font-bold">
                                                {content.cTitle}
                                            </h1>
                                            <h1 className="text-secondary md:text-right text-center text-sm mt-4">
                                                {content.cDescription}
                                            </h1>
                                        </Link>

                                        <div className="flex space-x-2 z-2 mb-10 md:mb-0">
                                            <Link href={`${content.cLink}`}>
                                                <button className="btn btn-primary mt-2">{getInteractIcon(content.cContentType)}</button>
                                            </Link>
                                            {data ?
                                            <button onClick={() => toggleBookmark(content.cId)} className={`btn ${isBookmarked(content.cId) ? 'btn-info' : 'btn-primary'} mt-2 space-x-1`}>
                                                {isBookmarked(content.cId) ? <MdBookmarkAdded /> : <MdOutlineBookmarkAdd />}
                                            </button>
                                            :
                                            <button onClick={() => router.push('/login')} className={`btn  btn-primary mt-2 space-x-1`}>
                                                <MdOutlineBookmarkAdd />
                                            </button>
                                            }
                                            <button  className="btn btn-primary mt-2" onClick={(() => handleShareClick(content.cTitle, `/${content.cContentType}/${content.cId}`))}><IoShareSocialOutline /></button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>

            <div className="embla__controls_Upbanner absolute">
                <div className="embla__buttons">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>
            </div>
            <div className='mb-10' />
        </section>
    )
}

export default UpBanner
