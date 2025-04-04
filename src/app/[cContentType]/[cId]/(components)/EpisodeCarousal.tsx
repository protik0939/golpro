'use client'
import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import './EmbalaCard.css'
import Link from 'next/link'
import Image from 'next/image'
import { PiHeadphonesFill } from 'react-icons/pi'
import { BiSolidMoviePlay } from 'react-icons/bi'
import { FaBookReader } from 'react-icons/fa'
import { IoShareSocialOutline } from 'react-icons/io5'
import { IEpisode } from '@/app/models/types'
import { NextButton, PrevButton, usePrevNextButtons } from '@/components/EmblaCarouselArrowButtons'
import toBase64 from '@/components/ToBasesf'
import shimmer from '@/components/Shimmer'
import { useShare } from '@/app/context/ShareContext'

type PropType = {
    title?: string,
    options?: EmblaOptionsType
    slidesInfo?: IEpisode[]
    contentType?: string;
    seasonNo?: number;
    mainTitle?: string;
}

const EpisodeCarousal: React.FC<PropType> = (props) => {
    const { title, options, contentType, slidesInfo, seasonNo, mainTitle } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)
    const { handleShareClick } = useShare();

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
            case 'story':
                return <FaBookReader />;
            default:
                return null;
        }
    };

    const getHoverClass = (index: number) => {
        if (index === 0) {
            return 'md:hover:translate-x-6 !important tooltip-left';
        } else if (index === (slidesInfo?.length ?? 0) - 1) {
            return 'md:hover:-translate-x-6 !important tooltip-right';
        }
        return '';
    };


    return (
        <section className="embla_Card">
            <div className="embla__controls_Card">
                <h1 className="border-l-8 border-secondary text-secondary font-bold pl-2">{title}</h1>
                <div className="embla__buttons">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>
            </div>



            <div className="embla__viewport_Card" ref={emblaRef}>
                <div className="embla__container_Card">
                    {
                        (slidesInfo ?? []).map((content, index) => {

                            return (
                                <div key={content.cId}
                                    data-tip={`${content.cDescription}`}
                                    className={`relative group md:hover:scale-110 hover:z-30 transition-all duration-100 ease-in-out  embla__slide_Card ${getHoverClass(index)} sliderBgGroup`} >

                                    <div className="relative md:m-2 m-[2px] group-hover:z-30 flex flex-col items-center">
                                        <h1 className='absolute top-2 right-2 shadow-2xl bg-black/30 backdrop-blur:lg p-1 rounded-lg text-xs'>Episode {content.cNo}</h1>
                                        <Link href={`/${contentType}/${mainTitle}/s${(seasonNo ?? 1).toString()}/${content.cId}`}>
                                            <Image
                                                src={content.cCard}
                                                alt="Responsive Image"
                                                width='1000'
                                                height='563'
                                                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1000, 563))}`}
                                                className="rounded-xl object-cover"
                                                onError={(e) => (e.currentTarget.src = '/src/app/assets/errorload/cardLoad.webp')}
                                            />
                                        </Link>

                                        <div className="absolute z-4 bottom-0 md:p-3 p-2 flex flex-col md:group-hover:items-start items-end md:group-hover:animate-slideIn cards-bg w-full rounded-b-xl ">
                                            <Link className="flex flex-col md:group-hover:items-start items-end" href={`/${contentType}/${mainTitle}/s${(seasonNo ?? 1).toString()}/${content.cId}`}>
                                                <Image
                                                    src={content.cLogo}
                                                    alt={`${content.cTitle}`}
                                                    width="100"
                                                    height="100"
                                                    className="!w-2/3 md:group-hover:!w-1/3 object-cover"
                                                    onError={(e) => (e.currentTarget.src = '/src/app/assets/errorload/logoLoad.webp')}
                                                />
                                            </Link>
                                            {/* Hidden content that will slide in and out */}
                                            <div className="hidden w-full md:group-hover:block md:group-hover:animate-slideIn animate-slideOut">
                                                <Link href={`/${contentType}/${mainTitle}/s${(seasonNo ?? 1).toString()}/${content.cId}`}>
                                                    <h1 className="font-bold text-[1vw]">{content.cTitle}</h1>
                                                    <p className="text-[.7vw] tooltip tooltip-primary" data-tip={content.cDescription}>
                                                        {content.cDescription.length > 30
                                                            ? content.cDescription.slice(0, 30) + '...'
                                                            : content.cDescription
                                                        }
                                                    </p>
                                                </Link>
                                                <div className="flex z-40 space-x-1">

                                                    <Link href={`/${contentType}/${mainTitle}/s${(seasonNo ?? 1).toString()}/${content.cId}`}><button className="btn btn-primary mt-2 min-h-6 h-6 w-6 min-w-6 p-1 text-l">
                                                        {getInteractIcon(contentType ?? "")}
                                                    </button></Link>

                                                    <button className="btn btn-primary mt-2 min-h-6 h-6 w-6 min-w-6 p-1 text-l" onClick={(() => handleShareClick(content.cTitle, `/${contentType}/${mainTitle}/s${(seasonNo ?? 1).toString()}/${content.cId}`))}><IoShareSocialOutline /></button>

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

export default EpisodeCarousal
