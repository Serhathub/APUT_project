import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { database } from "./server"; 

export async function secureMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.session.userId) {
    try {
      const usersCol = database.collection("users");
      const user = await usersCol.findOne({ _id: new ObjectId(req.session.userId) });
      if (user) {
        res.locals.user = user;
        next();
      } else {
        res.redirect("/login");
      }
    } catch (err) {
      console.error("Fout bij ophalen van user:", err);
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
}
