import {create, read, remove, update} from './bridge';

// GLOBALS
const getSnippets = async (user, meta) => {
    const response = await read(`${user ? `${user}/` : ''}snippets${meta ? '?meta=true' : ''}`);

    if (response.status == 200) {
        return response.msg;
    }

    return response;
};

const getUsers = async () => {
    const response = await read(`users`);

    // console.log(response);
    if (response.status == 200) {
        return response.msg;
    }
    return response;
};

const readCoworkerRules = async () => {
    const response = await read(`coworkerRules`);

    if (response.status == 200) {
        return response.msg;
    }
    return response;
};

const createCoworkerRules = async (body) => {
    const response = await create(`coworkerRules`, body);

    if (response.status == 200) {
        return response.msg;
    }
    return response;
};

const updateCoworkerRules = async (body) => {
    const response = await update(`coworkerRules`, body);

    if (response.status == 200) {
        return response.msg;
    }
    return response;
};

const deleteCoworkerRules = async (body) => {
    const response = await remove(`coworkerRules`, body);

    if (response) {
        if (response?.redirect) {
            return 'unauthorized';
        }
        // console.log('fetching');
        console.log(response);
        if (response.status == 200) {
            return response.msg;
        }
        return;
    }
};

export {
    getSnippets,
    getUsers,
    readCoworkerRules,
    createCoworkerRules,
    updateCoworkerRules,
    deleteCoworkerRules,
};
