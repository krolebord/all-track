export const lazy = <TArgs extends unknown[], TReturn>(fn: (...args: TArgs) => TReturn) => {
  let initialized = false;
  let result: TReturn;
  return (...args: TArgs) => {
    if (!initialized) {
      initialized = true;
      result = fn(...args);
    }
    return result;
  };
};
