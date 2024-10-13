export interface TResDataUpBanner {
    cTitle: string;
    cDescription: string;
    cLandscape: string;
    cPortrait: string;
    cLogo: string;
    cCard: string;
    cLink: string;
    cSquare: string;
    cTrailerLink: string;
    cYtId: string;
    cTrailerYtId: string;
    cinteract: string;
    width: number;
    height: number;
}

export interface TsettingBanner {
    dots: boolean;
    infinite: boolean;
    slidesToShow: number;
    slidesToScroll: number;
    autoplay: boolean;
    speed: number;
    autoplaySpeed: number;
    pauseOnHover: boolean;
    beforeChange: (current: number, next: number) => void;
    afterChange: () => void;
}
