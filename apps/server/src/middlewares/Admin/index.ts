import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserData } from "../../types";
import { JWT_SECRET } from "../../routes/v1";

export const isUserAdmninMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const AuthHeader = req.headers.authorization;
    const authToken = AuthHeader?.split(" ")[1];

    if (!authToken) {
      throw new Error("Auth Token Not Provided");
    }

    const userInfo = jwt.verify(authToken, JWT_SECRET) as UserData;
    console.log(userInfo);

    if (userInfo.role !== "Admin") {
      throw new Error("Don't have the required permissions");
    }
    console.log("here");

    req.userId = userInfo.id;
    next();
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
};
