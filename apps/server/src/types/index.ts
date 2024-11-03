import z from "zod";

const userRole = z.enum(["admin", "user"]);

export const signUpData = z.object({
  username: z.string(),
  password: z.string(),
  type: userRole.optional(),
});

export const signInData = z.object({
  username: z.string(),
  password: z.string(),
});

export const UpdateMetaData = z.object({
  avatarId: z.string(),
});

export const BulkDataRequest = z.object({
  ids: z.array(z.string()),
});

export const addElementData = z.object({
  imageUrl: z.string(),
  width: z.number(),
  height: z.number(),
  static: z.boolean(),
});

export const updateElementData = z.object({
  imageUrl: z.string(),
});

export const createAvatarData = z.object({
  imageUrl: z.string(),
  name: z.string(),
});

export const CreateMapData = z.object({
  thumbnail: z.string(),
  dimensions: z.string(),
  name: z.string(),
  defaultElements: z.array(
    z.object({
      elementId: z.string(),
      x: z.number(),
      y: z.number(),
    })
  ),
});

export const CreateSpaceData = z.object({
  name: z.string(),
  dimensions: z.string().optional(),
  mapId: z.string().optional(),
  thumbnail: z.string().optional(),
});

export const addElementToSpace = z.object({
  elementId: z.string(),
  spaceId: z.string(),
  x: z.number(),
  y: z.number(),
});

export const deleteElementFromSpaceData = z.object({
  id: z.string(),
});

export interface UserData {
  id: string;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
      role?: string;
    }
  }
}
