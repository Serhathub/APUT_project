import { ObjectId } from "mongodb";

export interface FavoriteClub {
  clubId: number;
  seen: number;
}
export interface BlacklistedClub {
  clubId: number;
  reason: string;
}
export interface FavoriteLeague {
  leagueId: number;
}
export interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  favorites: FavoriteClub[];
  blacklistedClubs: BlacklistedClub[];
  favoriteLeague: Number;
  highscore?: number;
}

export interface Coach {
  name: string;
}
export interface Area {
  id: number;
  name: string;
  code: string;
  flag: string;
}
export interface Player {
  id: number;
  name: string;
  position: string;
  nationality: string;
}
export interface Club {
  _id?: ObjectId;
  id: number;
  area?: Area;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  address: string;
  website: string;
  founded: number;
  clubColors: string;
  venue: string;
  runningCompetitions: League[]
  lastUpdated: string;
  coach?: Coach;
  squad?: Player[];
  staff?: any[];
  league?: string;
}
export interface League {
  _id?: ObjectId;
  id: number;
  area: {
    name: string;
    code: string;
    flag: string;
  };
  name: string;
  code: string;
  type: string;
  emblem: string;
  plan: string;
  currentSeason: any;
  numberOfAvailableSeasons: number;
  lastUpdated: string;
}