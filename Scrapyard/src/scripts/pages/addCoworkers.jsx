import React from 'react';
import {useState} from 'react';
import {useRef} from 'react';
import ExceptionsPopUp from '../components/exceptionsPopUp';
import AccessControl from '../components/accessControl';
import {useEffect} from 'react';

export default function AddRules() {
    const [coworkersState, setCoworkersState] = useState({});
    const [popUpState, setPopUpState] = useState({showExceptions: false});
    const newCoworkerInput = useRef('');

    // list of checkboxes
    const genericAccessRefs = useRef({
        new: {read: '', update: '', delete: ''},
        old: {},
    });

    useEffect(() => {
        (async () => {
            // get coworkers
            setCoworkersState({
                generic: {
                    venego: {read: true, update: false, delete: false},
                    '3disa': {read: true, update: false, delete: false},
                },
                exception: {
                    venego: {snip1: {read: true, update: false, delete: false}},
                    '3disa': {snip2: {read: true, update: false, delete: false}},
                },
            });
        })();
    }, []);

    const exceptionAccessRefs = useRef({
        new: {},
        old: {},
    });

    const getCoworkerAccess = (username) => {
        const access = {};

        // this spagetty needs some clean up
        const userExceptions = exceptionAccessRefs.current.old[username];
        access.exception = Object.keys(userExceptions).reduce((acc, excObjKey) => {
            acc[excObjKey] = Object.keys(userExceptions[excObjKey]).reduce((acc, accessObjKey) => {
                acc[accessObjKey] = userExceptions[excObjKey][accessObjKey].defaultChecked;
                return acc;
            }, {});
            return acc;
        }, {});

        access.generic = Object.keys(genericAccessRefs.old[username]).reduce((acc, objKey) => {
            acc[objKey] = genericAccessRefs.current.old[username][objKey].defaultChecked;
            return acc;
        }, {});

        return access;
    };

    const addNewCoworker = (e) => {
        e.preventDefault();
        // parse refs
        // send user changes
    };

    const showExceptionsPopUp = (coworker) => {
        setPopUpState({...popUpState, showExceptions: true, coworker});
    };

    const hidePopUp = () => {
        setPopUpState({...popUpState, showExceptions: false});
    };
    // console.log(coworkersState.generic);
    const listCoworkers = () =>
        coworkersState.generic ? (
            Object.keys(coworkersState.generic).map((username) => {
                genericAccessRefs.current.old[username] = coworkersState.generic[username];
                return (
                    <li key={username}>
                        <div className="flex gap-2">
                            <div>
                                <img src="" alt="" />
                                <span>{username}</span>
                            </div>
                            <AccessControl ref={genericAccessRefs.current.old[username]} />

                            <button>Update</button>
                            <button>delete</button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    showExceptionsPopUp({
                                        [username]: coworkersState.exceptions[username],
                                    });
                                }}
                            >
                                exceptions
                            </button>
                        </div>
                    </li>
                );
            })
        ) : (
            <></>
        );

    const updateCoworkerExceptionCB = (coworkerExceptions) => {
        exceptionAccessRefs.current.old[Object.keys(popUpState.coworker)[0]] = coworkerExceptions;
    };

    return (
        <div>
            <div className="flex gap-4">
                <input type="text" placeholder="user" ref={newCoworkerInput} />
                <AccessControl ref={genericAccessRefs.current.new} />
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        showExceptionsPopUp({['new']: {}});
                    }}
                >
                    exceptions
                </button>
                <button
                    className="border-1-lime border-radius-[50%] text-xl"
                    onClick={addNewCoworker}
                >
                    add Rule
                </button>
            </div>
            <div className="mt-4">
                <ul>{listCoworkers()}</ul>
            </div>
            {popUpState.showExceptions ? (
                <ExceptionsPopUp
                    updateCoworkerExceptionCB={updateCoworkerExceptionCB}
                    hidePopUp={hidePopUp}
                    ref={exceptionAccessRefs}
                    coworker={popUpState.coworker}
                />
            ) : (
                <></>
            )}
        </div>
    );
}
