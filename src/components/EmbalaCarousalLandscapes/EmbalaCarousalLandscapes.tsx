'use client'
import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from '../EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import './EmbalaLandscapes.css'
import Link from 'next/link'
import { slidesInfo } from '@/model/slides-Info'
import Image from 'next/image'
import { PiHeadphonesFill } from 'react-icons/pi'
import { BiSolidMoviePlay } from 'react-icons/bi'
import { FaBookReader } from 'react-icons/fa'
import { IoShareSocialOutline } from 'react-icons/io5'
import { MdOutlineBookmarkAdd } from 'react-icons/md'
import toBase64 from '../ToBasesf'
import shimmer from '../Shimmer'

type PropType = {
    title?: string,
    options?: EmblaOptionsType
}

const EmbalaCarousalLandscapes: React.FC<PropType> = (props) => {
    const { title, options } = props
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
            return 'big:hover:translate-x-14 !important';
        } else if (index === slidesInfo.length - 1) {
            return 'big:hover:-translate-x-14 !important';
        }
        return '';
    };


    return (
        <section className="embla_Landscapes">
            <div className="embla__controls_Landscapes">
                <h1 className="border-l-8 border-secondary text-secondary font-bold pl-2">{title}</h1>
                <div className="embla__buttons">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>
            </div>



            <div className="embla__viewport_Landscapes" ref={emblaRef}>
                <div className="embla__container_Landscapes">
                    {
                        slidesInfo.map((content, index) => {

                            return (
                                <div key={content.cTitle}
                                    data-tip={`${content.cDescription}`}
                                    className={`relative group big:hover:scale-125 hover:z-30 transition-all duration-100 ease-in-out ${getHoverClass(index)} embla__slide_Landscapes`} >

                                    <div className="relative m-2 sm:m-[2px] group-hover:z-30 flex flex-col items-center">
                                        <Link href={`${content.cLink}`}>
                                            <Image
                                                src={content.cLandscape}
                                                alt="Responsive Image"
                                                width='1000'
                                                height='479'
                                                className="rounded-xl object-cover"
                                                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1000, 479))}`}
                                            />
                                        </Link>

                                        <div className=" w-full absolute z-4 bottom-0 p-3 sm:p-2 flex flex-col big:group-hover:items-start items-end big:group-hover:animate-slideIn big:group-hover:carousal-bg-pt rounded-b-xl">
                                            <Link className="flex flex-col big:group-hover:items-start items-end" href={`${content.cLink}`}>
                                                <Image
                                                    src={content.cLogo}
                                                    alt={`${content.cTitle}`}
                                                    width="100"
                                                    height="100"
                                                    className="!w-2/3 big:group-hover:!w-1/3 object-cover"
                                                />
                                            </Link>
                                            {/* Hidden content that will slide in and out */}
                                            <div className="hidden w-full big:group-hover:block big:group-hover:animate-slideIn animate-slideOut">
                                                <Link href={`${content.cLink}`}>
                                                    <h1 className="font-bold text-[1vw]">{content.cTitle}</h1>
                                                    <p className="text-[.7vw]">
                                                        {content.cDescription.length > 30
                                                            ? content.cDescription.slice(0, 30) + '...'
                                                            : content.cDescription
                                                        }
                                                    </p>
                                                </Link>
                                                <div className="flex z-40 space-x-1">

                                                    <Link href={`${content.cLink}`}><button className="btn btn-primary mt-2 min-h-6 h-6 w-6 min-w-6 p-1 text-l">
                                                        {getInteractIcon(content.cinteract)}
                                                    </button></Link>

                                                    <button className="btn btn-primary mt-2 min-h-6 h-6 w-6 min-w-6 p-1 text-l"><IoShareSocialOutline /></button>
                                                    <button className="btn btn-primary mt-2 min-h-6 h-6 w-6 min-w-6 p-1 text-l"><MdOutlineBookmarkAdd /></button>

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

export default EmbalaCarousalLandscapes
