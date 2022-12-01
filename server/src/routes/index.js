const express = require('express');
const router = express.Router();
const controller = require('../controller');
const path = require('path');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log('l8 routes ', file);
        cb(null, 'src/media/avatars/');
    },
    filename: (req, file, cb) => {
        // console.log('l12 routes ', file);
        cb(null, req.user.username + path.extname(file.originalname));
    },
});
const upload = multer({storage});
// const passport = require('../passport/local');

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

// initilialize SSE and notification queue
router.get('/listenEvent', controller.events.listen);
// get list of notifications
router.get('/getEvents', controller.events.read);
router.get('/checkUnreadNotifications', controller.notifications.checkUnread);
router.get('/notifications', controller.notifications.read);
router.put('/markNotificationsRead', controller.notifications.markAllRead);

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
router.put('/users', gotoLogin, upload.single('avatar'), controller.user.editUser);

// snippets
router.get('/snippets', gotoLogin, controller.snippet.readAll);
router.get('/:user/snippets', gotoLogin, controller.snippet.readUserAll);

router.get('/:user/:snippetID', gotoLogin, controller.snippet.read);
router.post('/:user/snippet', gotoLogin, controller.snippet.create);
router.put('/:user/:snippetID', gotoLogin, controller.snippet.edit);
router.delete('/:user/:snippetID', gotoLogin, controller.snippet.remove);

router.get('/categories', controller.categories.readAll);
router.get('/languages', controller.languages.readAll);

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

router.get('/media/:section/:file', controller.media.getFile);

module.exports = router;
