export interface IncomingMessageRequestData {
  type: "join" | "move";
  payload: {
    spaceId?: string;
    token?: string;
    x?: string;
    y?: string;
  };
}

export interface Positions {
  [roomId: string]: {
    [userId: string]: {
      x: number;
      y: number;
    };
  };
}

export interface Space {
  id: string;
  width: string;
  height: string;
  elements: spaceElement[];
}

export interface Element {
  id: string;
  width: string;
  height: string;
}

interface spaceElement {
  id: string;
  x: string;
  y: string;
}

export interface userJwtData {
  id: string;
  username: string;
  role: string;
}
