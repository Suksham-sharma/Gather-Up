import { Request, Response, Router } from "express";

export const adminRouter = Router();

adminRouter.post("/element", (req: Request, res: Response) => {});
adminRouter.put("/element/:elementId", (req: Request, res: Response) => {});
adminRouter.post("/element/avatar", (req: Request, res: Response) => {});
adminRouter.post("/map", (req: Request, res: Response) => {});
