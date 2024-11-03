import { Request, Response, Router } from "express";
import { CreateSpaceData } from "../../../types";
import prismaClient from "@repo/db/client";
import { isRegisteredUserMiddleware } from "../../../middlewares/User";

export const spaceRouter = Router();

spaceRouter.post(
  "/",
  isRegisteredUserMiddleware,
  async (req: Request, res: Response) => {
    try {
      const createSpacePayload = CreateSpaceData.safeParse(req.body);
      const userId = req?.userId;

      if (!userId) {
        throw new Error("Auth Failed");
      }

      if (!createSpacePayload.success) {
        throw new Error("Data format , not valid");
      }

      const { name, dimensions, mapId, thumbnail } = createSpacePayload.data;
      const [width, height] = dimensions ? dimensions.split("x") : [];

      if (!dimensions && !mapId) {
        throw new Error("both MapId , and dimensions can't be absent ");
      }

      if (!mapId) {
        if (!width && height) {
          throw new Error(" The Dimensions are incorrect");
        }
        if (!width || !height) {
          throw new Error("Invalid Dimensions");
        }
        const createdSpace = await prismaClient.space.create({
          data: {
            name: name,
            width: Number(width),
            height: Number(height),
            creatorId: userId,
            thumbnail: thumbnail ? thumbnail : null,
          },
        });

        res.status(200).json({ spaceId: createdSpace.id });
        return;
      }

      const findMap = await prismaClient.map.findUnique({
        where: {
          id: mapId,
        },
        select: {
          id: true,
          width: true,
          height: true,
          thumbnail: true,
          mapElements: true,
        },
      });

      if (!findMap) {
        throw new Error("No map found with the given Id");
      }

      await prismaClient.$transaction(async () => {
        const createdSpace = await prismaClient.space.create({
          data: {
            name: name,
            width: Number(width),
            height: Number(height),
            creatorId: req.userId!,
          },
        });

        if (!findMap.mapElements) {
          return;
        }

        const elementsData = findMap.mapElements.map((elementInfo: any) => {
          const data = {
            spaceId: createdSpace.id,
            elementId: elementInfo.elementId,
            x: elementInfo.x,
            y: elementInfo.y,
          };
          return data;
        });

        await prismaClient.spaceElements.createMany({
          data: elementsData,
        });

        res.status(200).json({ spaceId: createdSpace.id });
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

spaceRouter.delete("/:spaceId", async (req: Request, res: Response) => {
  try {
    const spaceId = req.params.spaceId;

    if (!spaceId) {
      throw new Error("spaceId not provided");
    }

    const findSpace = await prismaClient.space.findUnique({
      where: {
        id: spaceId,
      },
    });

    if (!findSpace) {
      throw new Error("Space with the given Id not found");
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

spaceRouter.get("/:spaceId", (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

spaceRouter.get("/all", (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

spaceRouter.post("/element", (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

spaceRouter.delete("/element", (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});
