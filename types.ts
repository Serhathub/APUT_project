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
  id: number;
  name: string;
  league: number;
}