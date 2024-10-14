'use client';
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import './SlickCarousalCss.css'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { TResDataUpBanner } from '../model/typeScript'
import Slider, { Settings } from "react-slick";
import { slidesInfo } from "@/model/slides-Info";
interface TsettingBanner extends Settings { }

export default function TopBanner() {
    const [portrait, setPortrait] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 850) {
                setPortrait(true);
            } else {
                setPortrait(false);
            }
        };


        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    const sliderSettings: TsettingBanner = {
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 4000,
        pauseOnHover: false,
        beforeChange: (current, next) => {
            setAnimating(true);
            setCurrentSlide(next);
        },
        afterChange: () => {
            setTimeout(() => {
                setAnimating(false);
            }, 1000);
        },

    };

    const getSlideClassName = (index: number) => {
        if (animating) {
            return currentSlide === index ? 'fade-slide-in' : 'fade-slide-out';
        }
        return '';
    };


    return <div>
        <Slider {...sliderSettings} className="overflow-hidden">
            {
                slidesInfo.map((content: TResDataUpBanner, index: number) => {

                    return (
                        <div key={content.cTitle} className={`relative flex justify-center items-center sm:aspect-[11/16] aspect-[16/9]`} >

                            <Link href={`${content.cLink}`} className="relative" >
                                <div className="w-full h-auto relative -z-20" >
                                    <Image src={portrait ? content.cPortrait : content.cLandscape}
                                        alt="Responsive Image"
                                        width='1920'
                                        height='1080'
                                        className="object-cover"
                                    />
                                </div>
                            </Link>
                            < div className=" sm:w-full w-1/2 sm:p-6 p-20 absolute h-fill right-0 bottom-0 sm:bottom-0 flex flex-col sm:items-center items-end justify-end h-full sm:h-1/2 carousal-bg sm:carousal-bg-pt z-2" >
                                <Link href={`${content.cLink}`} className="right-0 bottom-0 sm:bottom-0 flex flex-col sm:items-center items-end justify-end" >
                                    <Image
                                        src={content.cLogo}
                                        alt="Logo Image"
                                        width='200'
                                        height='200'
                                        className={`!w-1/3 object-cover ${getSlideClassName(index)}`
                                        } />
                                    <h1 className="text-secondary text-right sm:text-center text-base mt-4 font-bold">
                                        {content.cTitle}
                                    </h1>
                                    < h1 className="text-secondary text-right sm:text-center text-sm mt-4" >
                                        {content.cDescription}
                                    </h1>
                                </Link>
                                < div className="flex space-x-2 z-2 sm:mb-10" >
                                    <Link href={`${content.cLink}`}> <button className="btn btn-primary mt-2" > {content.cinteract} </button></Link >
                                    <button className="btn btn-primary mt-2 space-x-1"> <h1>Bookmark </h1><MdOutlineBookmarkAdd /> </button>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </Slider>
    </div>;
};

