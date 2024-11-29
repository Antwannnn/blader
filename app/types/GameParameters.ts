export enum LengthParameter {
  SHORT = "Short",
  MEDIUM = "Medium",
  LONG = "Long",
  VERY_LONG = "Very Long",
}

export enum SentenceParameter {
  QUOTE = "Quote",
  RANDOM = "Random",
  // NOT IMPLEMENTED IN THE FIRST VERSION
  //CUSTOM = "Custom",
  //MIRROR = "Mirror",
}

export enum GameTypeParameter {
  TYPE_TESTER,
  TYPE_RACER,
}

export enum GameState {
  STARTED,
  RESET,
  ENDED,
}

export type Quote = {
  id: string;
  content: string;
  author: string;
  tags: string[];
  length: number;
};

export const getLengthByEnumParameter = (length: LengthParameter): number => {
  switch (length) {
    case LengthParameter.SHORT:
      return 10;
    case LengthParameter.MEDIUM:
      return 30;
    case LengthParameter.LONG:
      return 50;
    case LengthParameter.VERY_LONG:
      return 70;
  }
};

export const getLengthByStringParameter = (length: string): number => {
  switch (length) {
    case "SHORT":
      return 10;
    case "MEDIUM":
      return 30;
    case "LONG":
      return 50;
    case "VERY_LONG":
      return 70;
    default:
      return 30;
  }
};

export const valueStringToKeyFormat = (value: string): string => {
  return value.replace(/ /g, "_").toUpperCase();
};
