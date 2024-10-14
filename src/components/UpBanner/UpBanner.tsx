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
import { slidesInfo } from '@/model/slides-Info'
import Image from 'next/image'
import { TResDataUpBanner } from '@/model/typeScript'
import { MdOutlineBookmarkAdd } from 'react-icons/md'
import Autoplay from 'embla-carousel-autoplay'
import toBase64 from '../ToBasesf'
import shimmer from '../Shimmer'

type PropType = {
    width?: number,
    options?: EmblaOptionsType
}

const UpBanner: React.FC<PropType> = (props) => {
    const { options } = props;
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

    return (
        <section className="embla_Upbanner">
            <div className="embla__viewport_Upbanner" ref={emblaRef}>
                <div className="embla__container_Upbanner">
                    {
                        slidesInfo.map((content: TResDataUpBanner, index: number) => {

                            const logoClass = index === visibleSlideIndex ? 'fade-in' : 'fade-out'

                            return (
                                <div key={content.cTitle} className={`relative flex justify-center items-center embla__slide_Upbanner`}>
                                    <Link href={`${content.cLink}`} className="relative">
                                        <div className="w-full h-auto relative -z-20">
                                            {/* Use Tailwind's sm: for portrait, and big: for landscape */}
                                            <Image
                                                src={content.cPortrait} // Default to portrait
                                                alt="Responsive Image"
                                                width='1094'
                                                height='1625'
                                                className="sm:block hidden object-cover"
                                                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1094, 1625))}`}
                                            />
                                            <Image
                                                src={content.cLandscape}
                                                alt="Responsive Image"
                                                width='2375'
                                                height='1137'
                                                className="big:block hidden object-cover" 
                                                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(2375, 1137))}`}
                                            />
                                        </div>
                                    </Link>

                                    <div className="sm:w-full w-1/2 sm:p-2 p-20 absolute h-fill right-0 bottom-0 sm:bottom-0 flex flex-col sm:items-center items-end justify-end h-full sm:h-1/2 carousal-bg sm:carousal-bg-pt z-2">
                                        <Link href={`${content.cLink}`} className="right-0 bottom-0 sm:bottom-0 flex flex-col sm:items-center items-end justify-end">
                                            <Image
                                                src={content.cLogo}
                                                alt="Logo Image"
                                                width='200'
                                                height='200'
                                                className={`!w-1/3 object-cover ${logoClass}`} // Add the animation class here
                                                loading='eager'
                                            />
                                            <h1 className="text-secondary text-right sm:text-center text-base mt-4 font-bold">
                                                {content.cTitle}
                                            </h1>
                                            <h1 className="text-secondary text-right sm:text-center text-sm mt-4">
                                                {content.cDescription}
                                            </h1>
                                        </Link>

                                        <div className="flex space-x-2 z-2 sm:mb-10">
                                            <Link href={`${content.cLink}`}>
                                                <button className="btn btn-primary mt-2">{content.cinteract}</button>
                                            </Link>
                                            <button className="btn btn-primary mt-2 space-x-1">
                                                <h1>Bookmark</h1>
                                                <MdOutlineBookmarkAdd />
                                            </button>
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
