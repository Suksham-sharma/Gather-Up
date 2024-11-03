import { Request, Response, Router } from "express";
import { isUserAdmninMiddleware } from "../../../middlewares/Admin";

export const userRouter = Router();

userRouter.post(
  "/metadata",

  (req: Request, res: Response) => {
    try {
    } catch (error: any) {}
  }
);

userRouter.get("/metadata/bulk", (req: Request, res: Response) => {
  try {
  } catch (error: any) {}
});

userRouter.get(
  "/test",
  isUserAdmninMiddleware,
  (req: Request, res: Response) => {
    console.log("working");
  }
);
