export interface TResDataUpBanner {
    cTitle: string;
    cDescription: string;
    cLandscape: string;
    cPortrait: string;
    cBanner: string;
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
    cGenre: string[];
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

export interface TMusicData {
    id: string;
    title: string;
    songSrc: string;
    songImage: string;
    singer: string[];
    description: string;
  }
  
  
export interface TMusicDataAnn {
    id: string;
    title: string;
    songSrc: string;
    songImage: string;
    singer: string[];
    description: string;
}

export interface TMusicContextType {
    selectedMusicIndex: number | null;
    isPlaying: boolean;
    isVisible: boolean;
    playMusic: (index: number) => void;
    stopMusic: () => void;
    playControl: () => void;
}