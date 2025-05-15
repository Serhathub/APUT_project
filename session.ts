import {uri} from './server';
import session, { MemoryStore } from "express-session";
import { User } from "./types";
import { MONGODB_URI } from "./database";
import mongoDbSession from "connect-mongodb-session";
const MongoDBStore = mongoDbSession(session);

const mongoStore = new MongoDBStore({
    uri: uri,
    collection: "sessions",
    databaseName: "login-express",
});


declare module 'express-session' {
    export interface SessionData {
        user?: User
    }
}

export default session({
  secret: "eenSuperGeheimeCodeVoorNu",
  resave: false,
  saveUninitialized: false,
  store: mongoStore, //bug sluit het na een tijdje de connectie -> Error: Error connecting to db: connect ECONNREFUSED 127.0.0.1:27017
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: false,
    sameSite: 'lax',
  }
});