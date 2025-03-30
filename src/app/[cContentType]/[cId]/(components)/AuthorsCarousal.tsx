'use client'
import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import './EmbalaTopTen.css'
import Link from 'next/link'
import Image from 'next/image'
import { IAuthor } from '@/app/models/types'
import toBase64 from '@/components/ToBasesf'
import shimmer from '@/components/Shimmer'
import { NextButton, PrevButton, usePrevNextButtons } from '@/components/EmblaCarouselArrowButtons'

type PropType = {
    title?: string,
    options?: EmblaOptionsType
    slidesInfo?: IAuthor[]
}

const AuthorsCarousal: React.FC<PropType> = (props) => {
    const { title, options, slidesInfo } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)



    const getHoverClass = (index: number) => {
        if (index === 0) {
            return 'md:hover:translate-x-4 !important';
        } else if (index === (slidesInfo?.length ?? 0) - 1) {
            return 'md:hover:-translate-x-4 !important';
        }
        return '';
    };


    return (
        <section className="embla_TopTen">
            <div className="embla__controls_TopTen">
                <h1 className="border-l-8 border-secondary text-secondary font-bold pl-2">{title}</h1>
                <div className="embla__buttons">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>
            </div>



            <div className="embla__viewport_TopTen" ref={emblaRef}>
                <div className="embla__container_TopTen">
                    {
                        (slidesInfo ?? []).map((content, index) => {

                            return (
                                <div key={content.authorId}
                                    data-tip={`${content.description}`}
                                    className={`relative group md:hover:scale-110 hover:z-30 transition-all duration-100 ease-in-out ${getHoverClass(index)} embla__slide_TopTen sliderBgGroup`} >

                                    <div className="relative md:m-2 m-[2px] group-hover:z-30 flex flex-col items-center">
                                        <Link href={`/authors/${content.authorId}`}>
                                            <Image
                                                src={content.imageUrl}
                                                alt={`${content.fullName}`}
                                                width='1000'
                                                height='1000'
                                                className="rounded-xl object-cover"
                                                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1000, 1000))}`}
                                                onError={(e) => (e.currentTarget.src = '/src/app/assets/errorload/squareLoad.webp')}
                                            />
                                        </Link>

                                        <div className="absolute z-4 bottom-0 md:p-3 p-2 flex flex-col md:group-hover:items-start items-end md::group-hover:animate-slideIn cards-bg w-full rounded-b-xl">
                                            <h1 className="font-extrabold text-sm px-3 shadow-inner shadow-base-100 text-center rounded-full">{content.fullName}</h1>
                                            <div className="hidden w-full md:group-hover:block md:group-hover:animate-slideIn animate-slideOut">
                                                <Link href={`/authors/${content.authorId}`}>
                                                    <h1 className="font-bold text-[1vw]">{content.fullName}</h1>
                                                    <p className="text-[.7vw] tooltip tooltip-primary" data-tip={content.description}>
                                                        {content.description.length > 30
                                                            ? content.description.slice(0, 30) + '...'
                                                            : content.description
                                                        }
                                                    </p>
                                                </Link>
                                                <div className="flex z-40 space-x-1">
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

export default AuthorsCarousal
