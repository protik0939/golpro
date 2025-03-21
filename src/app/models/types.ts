export interface IContent {
  cId: string;
  cTitle: string;
  cContentType: string;
  cDescription: string;
  cLandscape: string;
  cPortrait: string;
  cBanner: string;
  cLogo: string;
  cCard: string;
  cSquare: string;
  cLink: string;
  cTrailerYtId: string;
  width: number;
  height: number;
  cGenre: string[];
  cAuthors: string[];
  cViwersAge: string;
  cUserVisit: number;
  cSeasons: ISeason[];
}



export interface ISeason {
  cId: string;
  cNo: string;
  cTitle: string;
  cLandscape: string;
  cPortrait: string;
  cBanner: string;
  cLogo: string;
  cCard: string;
  cSquare: string;
  cEpisodes: IEpisode[];
  cDescription: string;
  cLink: string;
}

export interface IEpisode {
  cId: string;
  cNo: string;
  cTitle: string;
  cDescription: string;
  cLandscape: string;
  cPortrait: string;
  cBanner: string;
  cLogo: string;
  cCard: string;
  cSquare: string;
  cLink: string;
  cYtId: string | null;
  cAudioSrc: string | null;
  cFullEpisode: string;
  cNextEpisodeSpoilers: string;
  cTrailerYtId: string | null;
}


export interface IAuthor {
  imageUrl: string;
  fullName: string;
  description: string;
}


export interface IGenre {
  genreId: string;
  genreName: string;
  genreDescription: string;
  imageUrl: string;
}