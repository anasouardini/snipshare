import {read} from './bridge';
import objMerge from './objMerge';

let snippets = [];
let whoami = '';

let alteredSnippet = {isPrivate: false, coworkers: {}};

// SNIPPET TEMP STATE

const setIsPrivate = (value) => {
    alteredSnippet.isPrivate = value;
};

const getIsPrivate = () => alteredSnippet.isPrivate;

const setCoworkers = (data) => {
    alteredSnippet.coworkers = data;
};

const getCoworkers = () => alteredSnippet.coworkers;

// GLOBALS

const updateWhoami = async () => {
    const response = await read('whoami');
    if (response && response.status == 200) {
        whoami = response.msg;
        return whoami;
    }

    console.log('network error, try again');
    return {err: 'fetchError'};
};
const getWhoami = () => whoami;

const updateSnippets = async () => {
    if (whoami == '') return {err: 'you need to check who is logged int first'};

    const response = await read(`${whoami}/snippets`);

    if (response) {
        console.log('fetching');
        console.log(response);
        if (response.status == 200 && !response.redirect) {
            snippets = response.msg;
            return snippets;
        }
        return {err: 'unauthorised'};
    }

    console.log('network error, try again');
    return {err: 'fetchError'};
};
const getSnippets = () => snippets;

const updateSnippet = () => {};
const getSnippet = () => {};

export {
    updateWhoami,
    getWhoami,
    updateSnippets,
    getSnippets,
    updateSnippet,
    getSnippet,
    setCoworkers,
    getCoworkers,
    setIsPrivate,
    getIsPrivate,
};
