import {create, read, remove, update} from './bridge';

let snippets = {};
let users = [];

// GLOBALS
const updateSnippets = async (user, meta) => {
    const response = await read(`${user ? `${user}/` : ''}snippets${meta ? '?meta=true' : ''}`);
    // console.log(response);

    if (response) {
        // console.log('fetching');
        // console.log(response);
        if (response.status == 200 && !response.redirect) {
            if (user) {
                snippets[user] = response.msg;
            } else {
                snippets = response.msg;
            }
            return response.msg;
        }
        return {err: 'unauthorized'};
    }

    console.log('network error, try again');
    return {err: 'fetchError'};
};
const getSnippets = (user) => snippets[user];

const updateSnippet = () => {};
const getSnippet = () => {};

const updateUsers = async () => {
    const response = await read(`users`);
    if (response) {
        if (response?.redirect) {
            return 'unauthorized';
        }
        // console.log('fetching');
        console.log(response);
        if (response.status == 200) {
            users = response.msg;
            return response.msg;
        }
        return;
    }
};
const getUsers = () => users;

const readCoworkerRules = async () => {
    const response = await read(`coworkerRules`);
    if (response) {
        if (response?.redirect) {
            return 'unauthorized';
        }
        // console.log('fetching');
        // console.log(response);
        if (response.status == 200) {
            return response.msg;
        }
        return;
    }
};

const createCoworkerRules = async (body) => {
    const response = await create(`coworkerRules`, body);

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

const updateCoworkerRules = async (body) => {
    const response = await update(`coworkerRules`, body);

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
    updateSnippets,
    getSnippets,
    updateSnippet,
    getSnippet,
    updateUsers,
    getUsers,
    readCoworkerRules,
    createCoworkerRules,
    updateCoworkerRules,
    deleteCoworkerRules,
};
