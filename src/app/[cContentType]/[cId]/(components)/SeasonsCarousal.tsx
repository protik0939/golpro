'use client'
import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import './Embala.css'
import Link from 'next/link'
import Image from 'next/image'
import { PiHeadphonesFill } from 'react-icons/pi'
import { BiSolidMoviePlay } from 'react-icons/bi'
import { FaBookReader } from 'react-icons/fa'
import { IoShareSocialOutline } from 'react-icons/io5'
import { MdOutlineBookmarkAdd } from 'react-icons/md'
import { ISeason } from '@/app/models/types'
import toBase64 from '@/components/ToBasesf'
import shimmer from '@/components/Shimmer'
import { NextButton, PrevButton, usePrevNextButtons } from '@/components/EmblaCarouselArrowButtons'

type PropType = {
    title?: string,
    options?: EmblaOptionsType
    slidesInfo?: ISeason[]
    contentType?: string;
}

const SeasonsCarousal: React.FC<PropType> = (props) => {
    const { title, options, slidesInfo, contentType } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)


    const getInteractIcon = (interactType: string) => {
        switch (interactType) {
            case 'Listen':
                return <PiHeadphonesFill />;
            case 'Watch':
                return <BiSolidMoviePlay />;
            case 'storyseries':
                return <FaBookReader />;
            default:
                return null;
        }
    };

    const getHoverClass = (index: number) => {
        if (index === 0) {
            return 'md:hover:translate-x-4 !important';
        } else if (index === (slidesInfo?.length ?? 0) - 1) {
            return 'md:hover:-translate-x-4 !important';
        }
        return '';
    };


    return (
        <section className="embla">
            <div className="embla__controls">
                <h1 className="border-l-8 border-secondary text-secondary font-bold pl-2">{title}</h1>
                <div className="embla__buttons">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>
            </div>



            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {
                        (slidesInfo ?? []).map((content, index) => {

                            return (
                                <div key={content.cTitle}
                                    className={`relative group md:hover:scale-110 hover:z-30 transition-all duration-100 ease-in-out ${getHoverClass(index)} embla__slide sliderBgGroup`} >
                                    <div className="relative md:m-2 m-[2px] group-hover:z-30 flex flex-col items-center">
                                        <h1 className='absolute top-2 right-2 shadow-2xl bg-black/30 backdrop-blur:lg p-1 rounded-lg text-sm'>Season {content.cNo}</h1>
                                        <Link href={`${content.cLink}`}>
                                            <Image
                                                src={content.cPortrait}
                                                alt="Responsive Image"
                                                width='674'
                                                height='1000'
                                                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1000, 674))}`}
                                                className="rounded-xl object-cover"
                                            />
                                        </Link>

                                        <div className="absolute z-4 bottom-0 p-2 md:p-3 flex flex-col md:group-hover:items-start items-center md:group-hover:animate-slideIn cards-bg w-full rounded-b-xl">
                                            <Link className="flex flex-col md:group-hover:items-start items-center" href={`${content.cLink}`}>
                                                <Image
                                                    src={content.cLogo}
                                                    alt={`${content.cTitle}`}
                                                    width="1000"
                                                    height="674"
                                                    className="!w-2/3 object-cover"
                                                />
                                            </Link>
                                            {/* Hidden content that will slide in and out */}
                                            <div className="hidden w-full md:group-hover:block md:group-hover:animate-slideIn animate-slideOut">
                                                <Link href={`${content.cLink}`}>
                                                    <h1 className="font-bold text-[1vw]">S{content.cNo} | {content.cTitle}</h1>
                                                    <p className={`text-[.7vw] tooltip tooltip-primary`} data-tip={content.cDescription}>
                                                        {content.cDescription.length > 50
                                                            ? content.cDescription.slice(0, 50) + '...'
                                                            : content.cDescription
                                                        }
                                                    </p>
                                                </Link>
                                                <div className="flex z-40 space-x-1">

                                                    <Link href={`${content.cLink}`}><button className="btn btn-primary mt-2 min-h-8 h-8 w-8 min-w-8 p-1 text-l">
                                                        {getInteractIcon(contentType ?? "")}
                                                    </button></Link>

                                                    <button className="btn btn-primary mt-2 min-h-8 h-8 w-8 min-w-8 p-1 text-l"><IoShareSocialOutline /></button>
                                                    <button className="btn btn-primary mt-2 min-h-8 h-8 w-8 min-w-8 p-1 text-l"><MdOutlineBookmarkAdd /></button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

        </section>
    )
}

export default SeasonsCarousal
