const debouncedActionsList = {};

const init = (key, func, delay = 500) => {
    let timer;
    debouncedActionsList[key] = (...args) => {
        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

const clear = (key) => {
    delete debouncedActionsList[key];
};

const run = (key, ...args) => {
    debouncedActionsList[key](...args);
};

export default {init, run, clear};
