//required to handle void return cases if necessary
export const getOrThrow = <T>(p: T | void) => {
  if (typeof p === "undefined") throw new Error("Get or throw used");
  return p;
};
