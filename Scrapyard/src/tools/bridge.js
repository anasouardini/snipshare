const server = {
    url: 'http://127.0.0.1:2000/',

    options: (method, body) => {
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
                ...(await res
                    .json()
                    .then((res) => res)
                    .catch(() => false)),
                status: res.status,
            };
        })
        .catch((err) => false);

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
