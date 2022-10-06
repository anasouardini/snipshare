const Bridges = {};

const setState = (componentID, stateName, newState) => {
    if (newState) {
        Bridges[componentID][stateName].state = newState;
    }
    Bridges[componentID][stateName].render(Bridges[componentID][stateName].state);
};

const getState = (componentID, stateName) => {
    if (stateName == '*') {
        return Object.keys(Bridges[componentID]).reduce((acc, stateName) => {
            acc[stateName] = Bridges[componentID][stateName];
            return acc;
        }, {});
    }
    return Bridges[componentID][stateName].state;
};

const initBridge = (componentID, bridgesObj) => {
    if (!bridgesObj?.render) {
        bridgesObj.render = () => {
            console.error('render function is not set');
        };
    }

    Bridges[componentID] = {...bridgesObj};
};

export const Bridge = {initBridge, getState, setState};
