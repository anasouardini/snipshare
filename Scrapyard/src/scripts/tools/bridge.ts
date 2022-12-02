const server = {
    url: 'http://127.0.0.1:2000/',

    options: (method, body) => {
        // console.log(body);
        const options = {
            method,
            mode: 'cors',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
            credentials: 'include',
        };

        if (body) options.body = JSON.stringify(body);

        return options;
    },
};

export const create = (route, body) =>
    fetch(server.url + route, server.options('post', body))
        .then(async (res) => {
            return {
                ...(await res.json().then((res) => res)),
                status: res.status,
            };
        })
        .catch(() => false);

// export const readBlob = (route) =>
//     fetch(server.url + route)
//         .then(async (res) => {
//             return URL.createObjectURL(await res.blob());
//         })
//         .catch((err) => err);

export const read = (route) =>
    fetch(server.url + route, server.options('get'))
        .then(async (res) => {
            return {
                ...(await res
                    .json()
                    .then((res) => res)
                    .catch(() => false)),
                status: res.status,
            };
        })
        .catch((err) => err);

export const updateFile = (route, body) =>
    fetch(server.url + route, {method: 'put', credentials: 'include', body})
        .then(async (res) => {
            return {
                ...(await res
                    .json()
                    .then((res) => res)
                    .catch(() => false)),
                status: res.status,
            };
        })
        .catch((err) => false);

export const update = (route, body) =>
    fetch(server.url + route, server.options('put', body))
        .then(async (res) => {
            return {
                ...(await res
                    .json()
                    .then((res) => res)
                    .catch(() => false)),
                status: res.status,
            };
        })
        .catch((err) => false);

export const remove = (route, body) =>
    fetch(server.url + route, server.options('delete', body))
        .then(async (res) => {
            return {
                ...(await res
                    .json()
                    .then((res) => res)
                    .catch(() => false)),
                status: res.status,
            };
        })
        .catch((err) => false);
