import { Router, Request, Response } from "express";
import { userRouter } from "./User";
import { adminRouter } from "./Admin";
import { spaceRouter } from "./Space";
import { signInData, signUpData } from "../../types";
import prismaClient from "@repo/db/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "secret";
export const apiRouterV1 = Router();

apiRouterV1.post("/signup", async (req: Request, res: Response) => {
  try {
    const signupPayload = signUpData.safeParse(req.body);
    if (!signupPayload.success) {
      throw new Error("Invalid format , not Valid");
    }

    const { username, password, type } = signupPayload.data;

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await prismaClient.user.create({
      data: {
        username,
        password: hashedPassword,
        role: type === "admin" ? "Admin" : "User",
      },
    });

    res.status(200).json({
      userId: user?.id,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    return;
  }
});

apiRouterV1.post("/signin", async (req: Request, res: Response) => {
  try {
    const signInPayload = signInData.safeParse(req.body);

    if (!signInPayload.success) {
      throw new Error("Invalid format , not Valid");
    }
    const findUser = await prismaClient.user.findUnique({
      where: {
        username: signInPayload.data.username,
      },
    });

    if (!findUser) {
      throw new Error("User doesn't exist");
    }

    const isAuthenticated = bcrypt.compare(
      signInPayload.data.password,
      findUser?.password
    );

    if (!isAuthenticated) {
      throw new Error("Invalid Password");
    }

    const token = jwt.sign(
      {
        id: findUser.id,
        username: findUser.username,
        role: findUser.role,
      },
      JWT_SECRET
    );

    res.json({
      token: token,
    });
  } catch (error: any) {
    res.status(403).json({ error: error.message });
    return;
  }
});

apiRouterV1.get("/elements", (req: Request, res: Response) => {
  try {
    return;
  } catch (error: any) {
    return;
  }
});

apiRouterV1.post("/avatars", (req: Request, res: Response) => {
  try {
    return;
  } catch (error: any) {
    return;
  }
});

apiRouterV1.use("/users", userRouter);
apiRouterV1.use("/admin", adminRouter);
apiRouterV1.use("/space", spaceRouter);
