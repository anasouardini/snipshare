const router = require('express').Router();
const controller = require('../controller');
// const passport = require('../passport/local');

const notifyQueue = require('../tools/notifyQueue');

const gotoLogin = (req, res, next) => {
    // console.log(req.user);
    // if not logged in
    if (!req?.user) {
        return res.json({redirect: '/login'});
    }

    next();
};

const gotoHome = (req, res, next) => {
    //if already logged in
    // console.log(req.user);
    if (req?.user) {
        return res.json({redirect: '/', msg: 'you are already signed in'});
    }

    next();
};

// todo: move this to the controller directory
router.get('/event', (req, res) => {
    const username = req.user.username;

    // console.log(username)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'Keep-alive');
    res.setHeader('Cache-Control', 'no-cache');

    notifyQueue[username] = {
        write: (payload) => {
            res.write(`event: ${payload.event}\nid:${payload.id}\ndata: ${payload.data}\r\n\r\n`);
        },
    };
    // console.log('streams', streams);

    res.on('close', () => {
        delete notifyQueue.streams[username];
        delete notifyQueue.queu?.[username];
        console.log('sse connection closed: ', username);
    });
});

// premade db structure
router.post('/restart', gotoLogin, controller.init.restart);
// auth
router.get('/auth/google', controller.signin.signinOAuth);

//! mods and users login routes should be separate
router.post('/signin', gotoHome, controller.signin.signinUser, controller.signin.signinMod);
router.post('/signup', gotoHome, controller.signup);
router.post('/logout', controller.logout);
router.get('/whoami', controller.whoami);
router.get('/users', gotoLogin, controller.user.readAll);

// snippets
router.get('/snippets', gotoLogin, controller.snippet.readAll);
router.get('/:user/snippets', gotoLogin, controller.snippet.readUserAll);

router.get('/:user/:snippetID', gotoLogin, controller.snippet.read);
router.post('/:user/snippet', gotoLogin, controller.snippet.create);
router.put('/:user/:snippetID', gotoLogin, controller.snippet.edit);
router.delete('/:user/:snippetID', gotoLogin, controller.snippet.remove);

router.get('/coworkerRules', gotoLogin, controller.coworkerRules.readAll);
router.get('/:coworker/coworkerRules', gotoLogin, controller.coworkerRules.readCoworker);
router.post(
    '/coworkerRules',
    gotoLogin,
    controller.coworkerRules.validateRules,
    controller.coworkerRules.create
);
router.put(
    '/coworkerRules',
    gotoLogin,
    controller.coworkerRules.validateRules,
    controller.coworkerRules.update
);
router.delete('/coworkerRules', gotoLogin, controller.coworkerRules.remove);

module.exports = router;
