'use client'
import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from '../EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import './Embala.css'
import Link from 'next/link'
import { slidesInfo } from '@/model/slides-Info'
import Image from 'next/image'
import { PiHeadphonesFill } from 'react-icons/pi'
import { BiSolidMoviePlay } from 'react-icons/bi'
import { FaBookReader } from 'react-icons/fa'
import { IoShareSocialOutline } from 'react-icons/io5'

type PropType = {
    options?: EmblaOptionsType
}

const EmbalaCarousel: React.FC<PropType> = (props) => {
    const { options } = props
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
            case 'Read':
                return <FaBookReader />;
            default:
                return null;
        }
    };

    const getHoverClass = (index: number) => {
        if (index === 0) {
            return 'big:hover:translate-x-6 !important';
        } else if (index === slidesInfo.length - 1) {
            return 'big:hover:-translate-x-6 !important';
        }
        return '';
    };


    return (
        <section className="embla">
            <div className="embla__controls">
                <h1 className="border-l-8 border-secondary text-secondary font-bold pl-2">Hot in town</h1>
                <div className="embla__buttons">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>
            </div>



            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {
                        slidesInfo.map((content, index) => {

                            return (
                                <div key={content.cTitle}
                                    className={`relative group big:hover:scale-125 hover:z-30 transition-all duration-100 ease-in-out ${getHoverClass(index)} embla__slide `} >

                                    <div className="relative m-2 sm:m-[2px] group-hover:z-30 flex flex-col items-center">
                                        <Link href={`${content.cLink}`}>
                                            <Image
                                                src={content.cPortrait}
                                                alt="Responsive Image"
                                                width='1000'
                                                height='1000'
                                                className="rounded-xl object-cover"
                                            />
                                        </Link>

                                        <div className="absolute z-4 bottom-0 p-3 sm:p-2 flex flex-col big:group-hover:items-start items-center big:group-hover:animate-slideIn big:group-hover:carousal-bg-pt rounded-b-xl">
                                            <Link className="flex flex-col big:group-hover:items-start items-center" href={`${content.cLink}`}>
                                                <Image
                                                    src={content.cLogo}
                                                    alt={`${content.cTitle}`}
                                                    width="1000"
                                                    height="1000"
                                                    className="!w-2/3 object-cover"
                                                />
                                            </Link>
                                            {/* Hidden content that will slide in and out */}
                                            <div className="hidden w-full big:group-hover:block big:group-hover:animate-slideIn animate-slideOut">
                                                <Link href={`${content.cLink}`}>
                                                    <h1 className="font-bold text-[1vw]">{content.cTitle}</h1>
                                                    <p className="text-[.7vw]">
                                                        {content.cDescription.length > 50
                                                            ? content.cDescription.slice(0, 50) + '...'
                                                            : content.cDescription
                                                        }
                                                    </p>
                                                </Link>
                                                <div className="flex z-40 space-x-1">

                                                    <Link href={`${content.cLink}`}><button className="btn btn-primary mt-2 min-h-8 h-8 w-8 min-w-8 p-1 text-l">
                                                        {getInteractIcon(content.cinteract)}
                                                    </button></Link>

                                                    <button className="btn btn-primary mt-2 min-h-8 h-8 w-8 min-w-8 p-1 text-l"><IoShareSocialOutline /></button>

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

export default EmbalaCarousel