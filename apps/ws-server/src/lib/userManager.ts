import { RawData, WebSocket } from "ws";
import { IncomingMessageRequestData, userJwtData } from "../types";
import { POSITIONS, SPACE_MEMBERS, SPACES } from "../db";
import jwt from "jsonwebtoken";

interface WsDetails {
  id: string;
  spaceId: string;
}

const JWT_SECRET = "1234";

class UserManager {
  static instance: UserManager;
  private UserDetails: Map<WebSocket, WsDetails> = new Map();

  static getInstance(): UserManager {
    if (!this.instance) {
      this.instance = new UserManager();
    }
    return this.instance;
  }

  private handleUserVerification(token: string) {
    try {
      const userInfo = jwt.verify(token, JWT_SECRET) as userJwtData;
      if (!userInfo) {
        throw new Error("Auth Failed");
      }
      return userInfo.id;
    } catch (error: any) {
      return;
    }
  }

  private hanldeRandomSpawningForUsers(spaceId: string) {
    if (!POSITIONS[spaceId]) {
      POSITIONS[spaceId] = {};
    }

    const spacePosition = POSITIONS[spaceId];
    // get Space Info
    const spaceInfo = SPACES.get(spaceId);

    if (!spaceInfo) {
      return;
    }

    const { width, height, elements } = spaceInfo;
  }

  handleIncomingWsRequest(message: RawData, ws: WebSocket) {
    try {
      const stringifiedMessage = message.toString();
      console.log(`Incoming message`, stringifiedMessage);

      const { type, payload }: IncomingMessageRequestData =
        JSON.parse(stringifiedMessage);

      if (type === "join") {
        // handle Space Joining Logic
        const { spaceId, token } = payload;

        if (!spaceId || !token) {
          ws.send("Invalid Data format");
          return;
        }

        if (!SPACES.has(spaceId!)) {
          ws.send(
            "Space with the given Id dosen't Exists , Please Recheck again"
          );
        }

        const userId = this.handleUserVerification(token!);
        if (!userId) {
          ws.send("Auth Failed");
          return;
        }

        this.handleSpaceSubscription(ws, spaceId, userId);

        return;
      }

      // handle Movement Logic
    } catch (error: any) {
      console.log("Error in handling incoming request", error);
      ws.send("Error in handling incoming request");
    }
  }

  handleSpaceSubscription(ws: WebSocket, spaceId: string, userId: string) {
    try {
      if (!SPACE_MEMBERS.has(spaceId)) {
        SPACE_MEMBERS.set(spaceId, []);
      }

      if (SPACE_MEMBERS.get(spaceId)?.includes(ws)) {
        ws.send("User is Already Part of the Space");
        return;
      }

      SPACE_MEMBERS.get(spaceId)?.push(ws);
      // handle spawning for the user
    } catch (error: any) {
      return;
    }
  }
}

export const userManager = UserManager.getInstance();
