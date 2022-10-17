import {create, read} from './bridge';

let snippets = {};
let users = [];

let alteredSnippet = {isPrivate: false, coworkers: {}, code: ''};

// SNIPPET TEMP STATE

const setIsPrivate = (value) => {
    alteredSnippet.isPrivate = value;
};

const getIsPrivate = () => alteredSnippet.isPrivate;

const setCoworkers = (data) => {
    alteredSnippet.coworkers = data;
};

const getCoworkers = () => alteredSnippet.coworkers;

const setSnipCode = (value) => (alteredSnippet.code = value);
const getSnipCode = () => alteredSnippet.code;

// GLOBALS

const updateSnippets = async (user) => {
    const response = await read(`${user ? `${user}/` : ''}snippets`);
    console.log(response);

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

export {
    updateSnippets,
    getSnippets,
    updateSnippet,
    getSnippet,
    setCoworkers,
    getCoworkers,
    setIsPrivate,
    getIsPrivate,
    setSnipCode,
    getSnipCode,
    updateUsers,
    getUsers,
    readCoworkerRules,
    createCoworkerRules,
};
