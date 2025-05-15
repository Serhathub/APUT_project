import { ObjectId } from "mongodb";

export interface User {
    _id?: ObjectId;
    username:string;
    email: string;
    password: string;
    createdAt:Date;
    favorites: number[];
}
export interface Club {
  id: number;
  name: string;
  league: number;
}

export interface ClubLogo {
  id: number;
  url: string;
}

export interface League {
  id: number;
  name: string;
  nationId: number;
  gender: string;
  clubs?: Club[];
}

export interface LeagueLogo {
  id: number;
  url: string;
}