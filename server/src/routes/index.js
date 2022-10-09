const router = require('express').Router();
const controller = require('../controller');
// const passport = require('../passport/local');

const gotoLogin = (req, res, next) => {
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

// premade db structure
router.post('/restart', gotoLogin, controller.init.restart);
// auth
router.post('/signin', gotoHome, controller.signin);
router.post('/signup', gotoHome, controller.signup);
router.post('/logout', controller.logout);
router.get('/whoami', controller.whoami);
// snippets
router.get('/users', gotoLogin, controller.user.readAll);
router.get('/snippets', gotoLogin, controller.snippet.readMiddleware, controller.snippet.readAll);
router.get(
    '/:user/snippets',
    gotoLogin,
    controller.snippet.readMiddleware,
    controller.snippet.readUserAll
);
router.get('/:user/:snippetID', gotoLogin, controller.snippet.read);
router.post('/:user/snippet', gotoLogin, controller.snippet.create);
router.put('/:user/:snippetID', gotoLogin, controller.snippet.edit);
router.delete('/:user/:snippetID', gotoLogin, controller.snippet.remove);

module.exports = router;
