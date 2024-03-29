const streams = {};

const loadNotifications = () => {};
const clearNotifications = () => {};

const queue = {};
const queueAdd = (user, sseMsg) => {
  if (streams?.[user]) queue[user] = sseMsg;
};

setInterval(() => {
  Object.keys(queue).forEach((user) => {
    if (streams?.[user]) {
      streams[user].write(queue[user]);
      delete queue[user];
    }
  });
}, 1000);

module.exports = { queue, queueAdd, streams };
