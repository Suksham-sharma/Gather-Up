import { WebSocket } from "ws";
import { Positions, Space, Element } from "../types";

export const SPACES: Map<string, Space> = new Map(); // updated according to server changes
export const POSITIONS: Positions = {}; // whenever space changes , Position[spaceId] will be reset
export const ELEMENTS: Map<string, Element> = new Map(); // updated according to server changes
export const SPACE_MEMBERS: Map<string, WebSocket[]> = new Map(); // cleared when space is updated
export const CurrentMap: Map<string, boolean[][]> = new Map(); // cleared for each space
