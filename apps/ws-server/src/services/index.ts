import WebSocket, { RawData } from "ws";
import { IncomingMessageRequestData, userJwtData } from "../types";
import jwt from "jsonwebtoken";
import { ELEMENTS, SPACES } from "../db";

// setUp currentMap
function handleSetUpCurrentMap(spaceId: string) {
  // make a space grid with the default as false , width x height , where width and height are the space width and height

  const space = SPACES.get(spaceId);

  if (!space) {
    return;
  }

  const { width, height } = space; // width: height: string

  const [spaceWidth, spaceHeight] = [Number(width), Number(height)];

  if (spaceWidth < 1 || spaceHeight < 1) {
    return;
  }

  const updatedSpaceGrid = Array.from({ length: spaceHeight }, () => {
    return Array.from({ length: spaceWidth }, () => 0);
  });

  if (!updatedSpaceGrid) {
    return;
  }

  const spaceElements = space.elements;

  if (!spaceElements) {
    return;
  }

  for (const spaceElement of spaceElements) {
    const { x: xString, y: yString, id: ElementId } = spaceElement;

    const [x, y] = [Number(xString), Number(yString)];

    const elementInfo = ELEMENTS.get(ElementId);

    if (!elementInfo) {
      continue;
    }

    const { width: elementWidth, height: elementHeight } = elementInfo;

    const [eWidth, eHeight] = [Number(elementWidth), Number(elementHeight)];

    for (let yCord = y; yCord < y + eHeight; yCord++) {
      for (let xCord = x; xCord < x + eWidth; xCord++) {
        if (
          yCord >= 0 &&
          yCord < spaceHeight &&
          xCord >= 0 &&
          xCord < spaceWidth
        ) {
          updatedSpaceGrid[yCord]![xCord] = 1;
        }
      }
    }
  }
}
