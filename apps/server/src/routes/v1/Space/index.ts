import { Request, Response, Router } from "express";
import {
  addElementToSpace,
  CreateSpaceData,
  deleteElementFromSpaceData,
} from "../../../types";
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
    const userId = req.body;

    if (!userId) {
      throw new Error("Auth Failed");
    }
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

    if (findSpace.creatorId !== userId) {
      res.status(403).json({ message: "UnAuthorized !!" });
      return;
    }

    await prismaClient.space.delete({
      where: {
        id: findSpace.id,
      },
    });

    await prismaClient.spaceElements.deleteMany({
      where: {
        spaceId: findSpace.id,
      },
    });

    res.status(200).json("Space deleted");
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

spaceRouter.get("/:spaceId", async (req: Request, res: Response) => {
  try {
    const spaceId = req.params.spaceId;

    if (!spaceId) {
      throw new Error("spaceId not provided");
    }

    const findSpace = await prismaClient.space.findUnique({
      where: {
        id: req.params.spaceId,
      },
      include: {
        elements: {
          include: {
            element: true,
          },
        },
      },
    });

    if (!findSpace) {
      throw new Error("Space with the given Id dosen't exists");
    }

    res.status(200).json({
      dimensions: `${findSpace.width}x${findSpace.height}`,
      elements: findSpace.elements.map((spaceElement) => ({
        id: spaceElement.id,
        element: {
          id: spaceElement.element.id,
          imageUrl: spaceElement.element.imageUrl,
          width: spaceElement.element.width,
          height: spaceElement.element.height,
          static: spaceElement.element?.static,
        },
      })),
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

spaceRouter.get(
  "/all",
  isRegisteredUserMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new Error("Auth Failed");
      }

      const spaces = await prismaClient.space.findMany({
        where: {
          creatorId: userId,
        },
      });

      if (!spaces) {
        throw new Error("No spaces are owned by the given user");
      }

      res.status(200).json({
        spaces: spaces.map((space) => ({
          id: space.id,
          name: space.name,
          thumbnail: space.thumbnail,
          dimensions: `${space.width}x${space.height}`,
        })),
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

spaceRouter.post("/element", async (req: Request, res: Response) => {
  try {
    const addElementToSpacePayload = addElementToSpace.safeParse(req.body);

    if (!addElementToSpacePayload.success) {
      throw new Error("Data format isn't valid");
    }

    const { elementId, spaceId, x, y } = addElementToSpacePayload.data;

    const findSpace = await prismaClient.space.findUnique({
      where: {
        id: spaceId,
      },
    });

    if (!findSpace) {
      throw new Error("Space with given Id found");
    }

    const findElement = await prismaClient.element.findUnique({
      where: {
        id: elementId,
      },
    });

    if (!findElement) {
      throw new Error("element with the given Id dosen't exists");
    }
    if (
      x < 0 ||
      y < 0 ||
      x + findElement.width > findSpace.width ||
      y + findElement.height > findSpace.height
    ) {
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

spaceRouter.delete(
  "/element",
  isRegisteredUserMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId;

      if (!userId) {
        throw new Error("Auth Failed");
      }

      const deleteElementFromSpace = deleteElementFromSpaceData.safeParse(
        req.body
      );

      const spaceElementId = deleteElementFromSpace.data?.id;

      if (!spaceElementId) {
        throw new Error("Element Id isn't provided");
      }

      const findSpaceElement = await prismaClient.spaceElements.findUnique({
        where: {
          id: spaceElementId,
        },
        include: {
          space: true,
        },
      });

      if (!findSpaceElement) {
        throw new Error("Element with the given Id dosen't exists");
      }

      const findSpace = findSpaceElement.space;

      if (findSpace?.creatorId !== userId) {
        throw new Error("You aren't the owner of the Space");
      }
      await prismaClient.spaceElements.delete({
        where: {
          id: spaceElementId,
        },
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);
