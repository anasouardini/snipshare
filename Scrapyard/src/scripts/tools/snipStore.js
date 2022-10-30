import {read} from './bridge';

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

const commonSnippetFields = [
    //- the attr.key is used as Ref and snippet prop
    {
        type: 'input',
        attr: {
            key: 'title',
            placeholder: 'title',
            name: 'title',
            type: 'text',
        },
    },
    {
        type: 'textarea',
        attr: {
            key: 'descr',
            placeholder: 'description',
            name: 'descr',
            type: 'textarea',
        },
    },
    {
        type: 'Snippet',
        attr: {
            key: 'snippet',
            type: 'text',
        },
    },
    {
        type: 'IsPrivate',
        attr: {
            key: 'isPrivate',
            type: 'checkbox',
        },
    },
    // {
    //     type: 'Coworkers',
    //     attr: {
    //         key: 'coworkers',
    //     },
    // },
];

export {getSnippets, getUsers, readCoworkerRules, commonSnippetFields};
