const getRandomInt = (from: number, to: number): number => {
  if (from > to) {
    [to, from] = [from, to];
  } else if (from === to) {
    return from;
  }

  return Math.floor(Math.random() * (to - from + 1)) + from;
};


const getRandomFixedPoint = (from: number, to: number, digits: number): number => {
  const significantFrom = Math.floor(from * (10 ** digits));
  const significantTo = Math.floor(to * (10 ** digits));

  return getRandomInt(significantFrom, significantTo) / (10 ** digits);
};


const getRandomArrayElements = <T>(arr: T[], count: number): T[] => {
  if (count >= arr.length) {
    return [...arr];
  } else if (count <= 0) {
    return [];
  }

  const availableFeatures = [...arr];

  return Array.from(
    { length: count },
    () => availableFeatures.splice(getRandomInt(0, availableFeatures.length - 1), 1)[0],
  );
};


const getOneRandomArrayElement = <T>(array: T[]): T => array[getRandomInt(0, array.length - 1)];


const getRandomBool = (): boolean => Math.random() >= 0.5;


export {
  getRandomInt,
  getRandomFixedPoint,
  getRandomArrayElements,
  getOneRandomArrayElement,
  getRandomBool,
};
