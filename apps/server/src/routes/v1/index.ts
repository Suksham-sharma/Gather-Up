import { Router, Request, Response } from "express";
import { userRouter } from "./User";
import { adminRouter } from "./Admin";
import { spaceRouter } from "./Space";

export const apiRouterV1 = Router();

apiRouterV1.post("/signup", (req: Request, res: Response) => {
  try {
    return;
  } catch (error: any) {
    return;
  }
});

apiRouterV1.post("/signin", (req: Request, res: Response) => {
  try {
    return;
  } catch (error: any) {
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
