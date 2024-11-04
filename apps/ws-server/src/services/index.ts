import { CurrentMap, ELEMENTS, POSITIONS, SPACES } from "../db";

function handleSetUpCurrentMap(spaceId: string) {
  // make a space grid with the default as false , width x height , where width and height are the space width and height

  const space = SPACES.get(spaceId);
  const spacePosition = POSITIONS[spaceId];

  if (!space) {
    return;
  }

  const { width, height } = space;

  const [spaceWidth, spaceHeight] = [Number(width), Number(height)];

  if (spaceWidth < 1 || spaceHeight < 1) {
    return;
  }

  const updatedSpaceGrid = Array.from({ length: spaceHeight }, () => {
    return Array.from({ length: spaceWidth }, () => false);
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
          updatedSpaceGrid[yCord]![xCord] = true;
        }
      }
    }

    for (const userId in spacePosition) {
      const userPosition = spacePosition[userId];

      if (!userPosition) return;
      updatedSpaceGrid[userPosition.y]![userPosition.x] = true;
    }

    CurrentMap.set(spaceId, updatedSpaceGrid);
  }
}
