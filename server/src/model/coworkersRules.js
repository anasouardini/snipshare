const poolPromise = require('./db');

const readAllRules = (props) => {
    // to check if user who is viewing all the snippets
    // in the home page is only seying snippets from accounts
    // which have the user as a coworker
    if (props.coworker) {
        return poolPromise(
            `select r.generic, r.exceptions, u.user as user, uu.user as coworker
                          from coworkersRules r 
                          inner join users u on r.user=u.id
                          inner join users uu on r.coworker=uu.id
                          where uu.user=?`,
            [props.coworker]
        );
    }

    // to list all coworkers for an account
    if (props.owner) {
        return poolPromise(
            `select r.generic, r.exceptions, u.user as user, uu.user as coworker
                          from coworkersRules r 
                          inner join users uu on r.coworker=uu.id
                          inner join users u on r.user=u.id
                          where u.user=?`,
            [props.owner]
        );
    }
};

const readCoworkerRules = (owner, coworker) => {
    return poolPromise(
        `select r.*, u.user as coworker, uu.user as user
                          from coworkersRules r 
                          inner join users uu on r.user=uu.id
                          inner join users u on r.coworker=u.id
                          where uu.user=? and u.user=?`,
        [owner, coworker]
    );
};

const create = (owner, rulesObj) => {
    return poolPromise(
        `insert into coworkersRules (user, coworker, generic, exceptions)
        select u.id as user, uu.id as coworker, ?, ? 
        from users u
        inner join users uu on u.user=? and uu.user=?;`,
        [
            JSON.stringify(rulesObj.generic),
            JSON.stringify(rulesObj.exceptions),
            owner,
            rulesObj.coworker,
        ]
    );
};

const update = (owner, rulesObj) => {
    return poolPromise(
        `update coworkersRules set generic=?, exceptions=?
         where coworker in (select id from users where user=?)
         and user in (select id from users where user=?)`,
        [
            JSON.stringify(rulesObj.generic),
            JSON.stringify(rulesObj.exceptions),
            rulesObj.coworker,
            owner,
        ]
    );
};

const remove = (owner, rulesObj) => {
    return poolPromise(
        `delete from coworkersRules
        where coworker in (select id from users where user=?)
        and user in (select id from users where user=?)`,
        [rulesObj.coworker, owner]
    );
};
//tests
module.exports = {
    readAllRules,
    readCoworkerRules,
    create,
    update,
    remove,
};
