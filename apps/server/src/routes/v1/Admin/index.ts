import { Request, Response, Router } from "express";
import { isUserAdmninMiddleware } from "../../../middlewares/Admin";
import {
  addElementData,
  createAvatarData,
  CreateMapData,
  updateElementData,
} from "../../../types";
import prismaClient from "@repo/db/client";

export const adminRouter = Router();

adminRouter.post(
  "/element",
  isUserAdmninMiddleware,
  async (req: Request, res: Response) => {
    try {
      const createElementPayload = addElementData.safeParse(req.body);
      if (!createElementPayload.success) {
        throw new Error("Invalid format , not Valid");
      }

      const { width, height, imageUrl } = createElementPayload.data;

      const createdElement = await prismaClient.element.create({
        data: {
          width: width,
          height: height,
          imageUrl: imageUrl,
        },
      });

      if (!createdElement) {
        throw new Error("Something Went Wrong");
      }

      res.status(200).json({
        id: createdElement?.id,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

adminRouter.put(
  "/element/:elementId",
  isUserAdmninMiddleware,
  async (req: Request, res: Response) => {
    try {
      const elementId = req?.params?.elementId;

      if (!elementId) {
        throw new Error("Element Id is required");
      }

      const updateElementPayload = updateElementData.safeParse(req.body);

      if (!updateElementPayload.success) {
        throw new Error("Data is not in the valid form");
      }

      const updatedElement = await prismaClient.element.update({
        where: { id: elementId },
        data: { imageUrl: updateElementPayload.data.imageUrl },
      });

      res.status(200).json({ message: "Element Updated" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

adminRouter.post(
  "/avatar",
  isUserAdmninMiddleware,
  async (req: Request, res: Response) => {
    try {
      const createAvatarPayload = createAvatarData.safeParse(req.body);

      if (!createAvatarPayload.success) {
        throw new Error("Data isn't in the valid form");
      }

      const { imageUrl, name } = createAvatarPayload.data;

      const createdAvatar = await prismaClient.avatar.create({
        data: {
          imageUrl: imageUrl,
          name: name,
        },
      });

      res.status(200).json({ avatarId: createdAvatar.id });
    } catch (error: any) {}
  }
);

adminRouter.post(
  "/map",
  isUserAdmninMiddleware,
  async (req: Request, res: Response) => {
    console.log("1wer");
    try {
      const CreateMapPayload = CreateMapData.safeParse(req.body);
      if (!CreateMapPayload.success) {
        throw new Error("Map creation Data isn't valid");
      }

      const { thumbnail, dimensions, name, defaultElements } =
        CreateMapPayload.data;

      const [width, height] = dimensions.split("x");
      if (!width || !height) {
        throw new Error("Invalid Dimensions");
      }

      await prismaClient.$transaction(async () => {
        const createdMap = await prismaClient.map.create({
          data: {
            name: name,
            thumbnail: thumbnail,
            width: parseInt(width),
            height: parseInt(height),
          },
        });

        console.log(defaultElements, createdMap);

        const elementsData = defaultElements.map((elementInfo) => {
          const data = {
            mapId: createdMap.id,
            elementId: elementInfo.elementId,
            x: elementInfo.x,
            y: elementInfo.y,
          };
          return data;
        });

        await prismaClient.mapElements.createMany({
          data: elementsData,
        });
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);
