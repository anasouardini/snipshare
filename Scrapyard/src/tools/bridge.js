const server = {
    url: 'http://127.0.0.1:2000/',

    options: (method, body) => ({
        method,
        headers: {
            Accept: 'application.json',
            'Content-Type': 'application/json',
        },
        cache: 'default',
        body: JSON.stringify(body),
        credentials: 'include',
    }),
};

export const create = (route, body) =>
    fetch(server.url + route, server.options('post', body))
        .then((res) =>
            res
                .json()
                .then((res) => res)
                .catch(() => false)
        )
        .catch((err) => false);
