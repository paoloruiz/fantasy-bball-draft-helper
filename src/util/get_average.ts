export const getAverage = (arr: number[]) => {
  return arr.reduce((a, b) => a + b) / arr.length;
};
