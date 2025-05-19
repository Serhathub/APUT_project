import { ObjectId } from "mongodb";

export interface FavoriteClub {
  clubId: number;
  seen: number;
}

export interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  favorites: FavoriteClub[];
}

export interface Club {
  _id?: ObjectId;
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  address: string;
  website: string;
  founded: number;
  clubColors: string;
  venue: string;
  lastUpdated: string;
}
export interface League {
  _id?: ObjectId;
  id: number;
  area: {
    name: string;
    code: string;
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