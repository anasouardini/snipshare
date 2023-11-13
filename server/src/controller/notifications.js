const Notifications = require('../model/notifications.js');

const read = async (req, res) => {
  if (!req.user) {
    return res.json({ msg: {} });
  }

  const response = await Notifications.read({ user: req.user.username });
  // console.log('l9 controller/notifications: ', response);
  if (!response || !response?.[0]) {
    return res
      .status(500)
      .json({ msg: 'something bad happended while feching notifications' });
  }

  return res.json({ msg: response[0] });
};

const checkUnread = async (req, res) => {
  const response = await Notifications.checkUnread({ user: req.user.username });
  // console.log('l9 controller/notifications: ', response[0]);
  if (!response || !response?.[0]) {
    return res
      .status(500)
      .json({ msg: 'something bad happended while feching notifications' });
  }

  return res.json({ msg: response[0].length });
};

const markAllRead = async (req, res) => {
  const response = await Notifications.markAllRead({ user: req.user.username });
  // console.log('l15 controller/notifications: ', response);
  if (!response || !response?.[0]) {
    return res.status(500).json({
      msg: 'something bad happended while marking notifications as read',
    });
  }

  return res.json({ msg: 'successfully marked all notifications as read' });
};

module.exports = { checkUnread, read, markAllRead };
