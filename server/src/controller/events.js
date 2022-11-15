const notifyQueue = require('../tools/notifyQueue');

// todo: add a route for reading notifications and marking them as read
const listen = (req, res) => {
    const username = req.user?.username;
    if (!username) return;

    // console.log(username)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'Keep-alive');
    res.setHeader('Cache-Control', 'no-cache');

    notifyQueue.streams[username] = {
        write: (payload) => {
            res.write(`
              event: ${payload.event}\nid:${payload.id}\ndata: ${payload.data}\r\n\r\n
            `);
        },
    };
    // console.log('streams', streams);

    res.on('close', () => {
        delete notifyQueue.streams[username];
        delete notifyQueue.queu?.[username];
        console.log('sse connection closed: ', username);
    });
};

const read = async (req, res) => {
    return res.json({msg: 'nothing'});
};

module.exports = {
    listen,
    read,
};
