export const lazy = <TFunc extends (...args: any[]) => any>(fn: TFunc) => {
  let initialized = false;
  let result: ReturnType<TFunc>;
  return (...args: Parameters<TFunc>) => {
    if (!initialized) {
      initialized = true;
      result = fn(...args);
    }
    return result;
  };
};
