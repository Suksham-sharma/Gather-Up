import { Request, Response, Router } from "express";
import { isUserAdmninMiddleware } from "../../../middlewares/Admin";
import { UpdateMetaData } from "../../../types";
import prismaClient from "@repo/db/client";
import { isRegisteredUserMiddleware } from "../../../middlewares/User";

export const userRouter = Router();

userRouter.post(
  "/metadata",
  isRegisteredUserMiddleware,
  async (req: Request, res: Response) => {
    try {
      const metaDataPayload = UpdateMetaData.safeParse(req.body);

      if (!metaDataPayload.success) {
        throw new Error("Data is in Invalid format");
      }

      const { avatarId } = metaDataPayload.data;

      const updatedUser = await prismaClient.user.update({
        where: { id: req.userId },
        data: {
          avatarId: avatarId,
        },
      });
      res
        .status(200)
        .json({ message: `Avatar Updated Succesfully ${updatedUser.id}` });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

userRouter.get(
  "/metadata/bulk",
  isRegisteredUserMiddleware,
  async (req: Request, res: Response) => {
    try {
      const bulkDataRequest = (req?.query?.ids ?? "[]") as string;
      const userIds = JSON.parse(bulkDataRequest);

      const bulkDataMetaData = await prismaClient.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
        select: {
          id: true,
          avatar: true,
        },
      });

      if (!bulkDataMetaData) {
        throw new Error("No Data Found");
      }

      res.status(200).json({
        avatars: bulkDataMetaData.map((data) => ({
          userId: data.id,
          imageUrl: data.avatar?.imageUrl,
        })),
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);
