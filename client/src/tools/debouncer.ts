interface debouncedActionsList {
  [key: string]: (...arg: any | string[]) => void;
}
const debouncedActionsList: debouncedActionsList | {} = {};

const init = (
  key: string,
  func: (...arg: any | string[]) => undefined,
  delay = 500,
) => {
  let timer: number;

  debouncedActionsList[key] = (...args: any | string[]) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = window.setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const clear = (key: string) => {
  delete debouncedActionsList[key];
};

const run = (key: string, ...args: any[]) => {
  debouncedActionsList[key](...args);
};

export default { init, run, clear };
