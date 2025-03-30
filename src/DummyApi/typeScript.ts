import { IAuthor } from "@/app/models/types";

export interface TResDataUpBanner {
    cId: string;
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
    cUserVisit: number;
    cAuthors: string[];
    cViwersAge: string;
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
    selectedContentIndex: number | null;
    selectedSeasonIndex: number | null;
    selectedMusicIndex: number | null;
    isPlaying: boolean;
    isVisible: boolean;
    playMusic: (cIndex: number, sIndex: number, eIndex: number) => void;
    stopMusic: () => void;
    playControl: () => void;
}




// Interface for an episode
export interface IEpisode {
    cDescription: string;
    cCard: string;
    cLogo: string;
    cNo: string;
    cId: string;
    cTitle: string;          // Title of the episode
    cSquare: string;         // Image URL for the episode
    cAudioSrc: string;      // Audio source URL
}

// Interface for a season
export interface ISeason {
    cDescription: string;
    cLandscape: string;
    cId: string;
    cNo: string;
    cTitle:string;
    cEpisodes: IEpisode[]; // Array of episodes in the season
}

// Main interface for an audio content
export interface IAudio {
    cAudioSrc: string;      // Audio source URL
    cId: string;            // Unique identifier
    cTitle: string;         // Title of the audio content
    cDescription: string;   // Description of the content
    cSquare: string;        // Image URL for the content
    cGenre: string[];       // Array of genre identifiers
    cAuthors: string[];     // Array of author names
    cSeasons: ISeason[];    // Array of seasons
}

// Type for a list of audio content
export type IAudioList = IAudio[];


export interface HoverCardProps {
    mdt: IEpisode;
    sci: null | number;
    ssi: null | number;
    smi: null | number;
    ipp: boolean;
    cAuthor: IAuthor[];
    cidx: number;
    sidx: number;
    midx: number;
}