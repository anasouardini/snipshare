import {read} from './bridge';

export const whoami = async () => {
    const response = await read('whoami');
    if (response && response.status == 200) {
        return response.msg;
    }

    console.log('network error, try again');
    return {err: 'fetchError'};
};

export const updateItems = async (user) => {
    const response = await read(`${user}/snippets`);

    if (response) {
        console.log('fetching');
        console.log(response);
        if (response.status == 200 && !response.redirect) {
            return response.msg;
        }
        return {err: 'unauthorised'};
    }

    console.log('network error, try again');
    return {err: 'fetchError'};
};
