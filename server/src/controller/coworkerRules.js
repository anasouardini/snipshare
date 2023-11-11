const CoworkerRules = require('../model/coworkersRules');
const User = require('../model/user');
const Z = require('zod');
const notifyQueue = require('../tools/notifyQueue');
const Notifications = require('../model/notifications');

const readAll = async (req, res) => {
  const owner = req.user.username;

  const response = await CoworkerRules.readAllRules({ owner });

  // console.log('l80 coworkerrules: ', response[0]);
  let rules = { generic: {}, exceptions: {} };
  if (response[0].length) {
    rules = {
      generic: response[0].reduce((acc, coworker) => {
        acc[coworker.coworker] = coworker.generic;
        return acc;
      }, {}),
      exceptions: response[0].reduce((acc, coworker) => {
        acc[coworker.coworker] = coworker.exceptions;
        return acc;
      }, {}),
    };
  }

  // console.log('readall coworkersrules', rules);
  res.json({ msg: rules });
};

const readCoworker = async (req, res) => {
  const owner = req.user.username;
  const coworker = req.query.params.coworker;

  const rulesResponse = await CoworkerRules.readCoworkerRules(owner, coworker);
  if (!rulesResponse[0].length) {
    return res.status(400).json({ msg: 'there is no such coworker' });
  }

  return res.status(200).json({
    msg: {
      generic: rulesResponse[0][0].generic,
      exceptions: rulesResponse[0][0].exceptions,
    },
  });
};

const validateRules = (req, res, next) => {
  // console.log('props coworkerrules', req.body.props);
  const accessObjSchema = Z.object({
    read: Z.boolean(),
    update: Z.boolean(),
    delete: Z.boolean(),
  });
  const genericAccessObjSchema = accessObjSchema.merge(
    Z.object({ create: Z.boolean() }),
  );

  const schema = Z.object({
    coworker: Z.string(),
    generic: genericAccessObjSchema,
    exceptions: Z.object({}).catchall(accessObjSchema),
  });
  // console.log(req.body.props.generic);
  // console.log(req.body.props.exceptions);

  if (schema.safeParse(req.body.props)?.error) {
    // console.log(schema.safeParse(req.body.props)?.error);
    return res
      .status(400)
      .json({ msg: 'the access is not formated correctly' });
  }

  next();
};

const create = async (req, res) => {
  const owner = req.user.username;
  // console.log(req.body.props);

  // -I- check if the potential coworker exists,
  // better to add coworkers by id and usernames like in discord
  const userResponse = await User.getUser(req.body.props.coworker);
  if (!userResponse) {
    return { status: 500, msg: 'something bad happened' };
  }
  if (!userResponse[0].length) {
    return res.status(400).json({ msg: 'this username does not exist' });
  }

  //-II- check if the user is already a coworker
  const coworkerResponse = await CoworkerRules.readCoworkerRules(
    owner,
    req.body.props.coworker,
  );

  if (!coworkerResponse) {
    return res.status(500).json({ msg: 'something bad happened' });
  }

  if (coworkerResponse[0].length) {
    return res.status(400).json({ msg: 'coworker already exists' });
  }

  //-III- ceating the coworker rule
  let createCoworkerResult = await CoworkerRules.create(owner, req.body.props);
  // console.log('createCoworkerResult l:158', createCoworkerResult);

  if (!createCoworkerResult?.[0]?.affectedRows) {
    return {
      status: 500,
      msg: 'could not add a coworker rule, try again later',
    };
  }

  createCoworkerResult = {
    status: 200,
    msg: 'coworker has been created successfully',
  };

  // todo: add notification to db, marked as unread
  const notificationsResponse = await Notifications.add({
    user: req.body.props.coworker,
    type: 'message',
    message: `${owner} gave you access to his account`,
    read: false,
  });
  // console.log(notificationsResponse);
  if (!notificationsResponse[0].affectedRows) {
    return res
      .status(500)
      .json({ msg: 'something bad happened while creating a coworker rule' });
  }
  notifyQueue.queueAdd(req.body.props.coworker, {
    event: 'message',
    id: 0,
    data: `${owner} gave you access to his account`,
  });

  return res
    .status(createCoworkerResult.status)
    .json({ msg: createCoworkerResult.msg });
};

const update = async (req, res) => {
  const owner = req.user.username;
  const response = await CoworkerRules.update(owner, req.body.props);
  if (!response?.[0]?.affectedRows) {
    return res.status(500).json({ msg: 'something bad happened' });
  }

  // todo: add notification to db, marked as unread
  const notificationsResponse = await Notifications.add({
    user: req.body.props.coworker,
    type: 'message',
    message: `${owner} has modified your permissions on his account`,
    read: false,
  });
  if (!notificationsResponse[0].affectedRows) {
    return res
      .status(500)
      .json({ msg: 'something bad happened while updating a coworker rule' });
  }
  notifyQueue.queueAdd(req.body.props.coworker, {
    event: 'message',
    id: 0,
    data: `${owner} has modified your permissions on his account`,
  });

  res.status(200).json({ msg: 'coworker updated successfully' });
};

const remove = async (req, res) => {
  const owner = req.user.username;
  // console.log(req.body);
  const response = await CoworkerRules.remove(owner, req.body.props);
  // console.log(response);
  if (!response) {
    return res.sedStatus(500);
  }

  if (!response[0]?.affectedRows) {
    return res.status(400).json({ msg: 'could not delete a coworker rule' });
  }

  // todo: add notification to db, marked as unread
  const notificationsResponse = await Notifications.add({
    user: req.body.props.coworker,
    type: 'message',
    message: `you are no longer have access to ${owner}'s account`,
    read: false,
  });
  // console.log(notificationsResponse);
  if (!notificationsResponse[0].affectedRows) {
    return res
      .status(500)
      .json({ msg: 'something bad happened while removing a coworker rule' });
  }
  notifyQueue.queueAdd(req.body.props.coworker, {
    event: 'message',
    id: 0,
    data: `you are no longer have access to ${owner}'s account`,
  });
  res.json({ msg: 'a coworker rule has been deleted successfully' });
};

module.exports = {
  readAll,
  readCoworker,
  validateRules,
  create,
  update,
  remove,
};
