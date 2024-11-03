import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../routes/v1";
import { UserData } from "../../types";

export const isRegisteredUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const authToken = authHeader?.split(" ")[1];

    if (!authToken) {
      throw new Error("Auth token not provided");
    }

    const userInfo = jwt.verify(authToken, JWT_SECRET) as UserData;

    if (!userInfo.id) {
      throw new Error("User dosen't Exists");
    }

    req.userId = userInfo.id;
    req.role = userInfo.role;
    next();
  } catch (error: any) {
    res.status(403).json({ message: error.message });
    return;
  }
};
