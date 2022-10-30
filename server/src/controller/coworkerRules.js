const CoworkerRules = require('../model/coworkersRules');
const User = require('../model/user');
const Z = require('zod');

const readAll = async (req, res) => {
    const owner = req.user.username;

    const response = await CoworkerRules.readAllRules({owner});

    // console.log(response[0][0]);
    let rules = {generic: {}, exceptions: {}};
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
    res.json({msg: rules});
};

const readCoworker = async (req, res) => {
    const owner = req.user.username;
    const coworker = req.query.params.coworker;

    const response = await CoworkerRules.readCoworkerRules(owner, coworker);

    let rules = [];
    rules = {
        generic: rulesResponse[0][0].generic,
        exceptions: rulesResponse[0][0].exceptions,
    };

    // console.log(response);

    res.json({msg: rules});
};

const validateRules = (req, res, next) => {
    // console.log('props coworkerrules', req.body.props);
    const accessObjSchema = Z.object({
        read: Z.boolean(),
        update: Z.boolean(),
        delete: Z.boolean(),
    });
    const genericAccessObjSchema = accessObjSchema.merge(Z.object({create: Z.boolean()}));

    const schema = Z.object({
        coworker: Z.string(),
        generic: genericAccessObjSchema,
        exceptions: Z.object({}).catchall(accessObjSchema),
    });
    // console.log(req.body.props.generic);
    // console.log(req.body.props.exceptions);

    if (schema.safeParse(req.body.props)?.error) {
        // console.log(schema.safeParse(req.body.props)?.error);
        return res.status(400).json({msg: 'the access is not formated correctly'});
    }

    next();
};

const create = async (req, res) => {
    const owner = req.user.username;
    // console.log(req.body.props);

    //-I- check if the coworker exists, better to add coworkers by id and usernames like in discord
    const userResponse = await User.getUser(req.body.props.coworker);

    if (!userResponse) {
        return res.sedStatus(500);
    }

    if (!userResponse[0].length) {
        return res.status(400).json({msg: 'this username does not exist'});
    }

    //II- check if the coworker is already there
    const coworkerResponse = await CoworkerRules.readCoworkerRules(owner, req.body.props.coworker);

    if (!coworkerResponse) {
        return res.sedStatus(500);
    }

    if (coworkerResponse[0].length) {
        return res.status(400).json({msg: 'this coworker already exists'});
    }

    // create the coworker rule
    const response = await CoworkerRules.create(owner, req.body.props);
    // console.log(response);

    if (!response) {
        return res.status(500).json({msg: 'could not add a coworker rule, try again later'});
    }

    if (!response[0]?.affectedRows) {
        return res.status(500).json({msg: 'could not add a coworker rule, try again later'});
    }

    res.json({msg: 'a coworker rule has been created successfully'});
};

const update = async (req, res) => {
    const owner = req.user.username;

    const response = await CoworkerRules.update(owner, req.body.props);

    if (!response) {
        return res.sedStatus(500);
    }

    if (!response[0]?.affectedRows) {
        return res.status(400).json({msg: 'could not update a coworker rule'});
    }

    res.json({msg: 'a coworker rule has been updated successfully'});
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
        return res.status(400).json({msg: 'could not delete a coworker rule'});
    }

    res.json({msg: 'a coworker rule has been deleted successfully'});
};

module.exports = {readAll, readCoworker, validateRules, create, update, remove};
