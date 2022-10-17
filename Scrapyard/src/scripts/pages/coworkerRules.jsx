import React from 'react';
import {useState} from 'react';
import {useRef} from 'react';
import ExceptionsPopUp from '../components/exceptionsPopUp';
import AccessControl from '../components/accessControl';
import {useEffect} from 'react';
import {createCoworkerRules, readCoworkerRules} from '../tools/snipStore';
import {useNavigate} from 'react-location';

export default function AddRules() {
    const navigate = useNavigate();
    const changeRoute = (to) => {
        navigate({to, replace: true});
    };

    const [coworkersState, setCoworkersState] = useState({});
    const [popUpState, setPopUpState] = useState({showExceptions: false});

    // list of checkboxes
    const genericAccessRefs = useRef({
        new: {read: '', update: '', delete: ''},
        old: {},
    });

    const exceptionAccessRefs = useRef({
        new: {coworkerUsername: {}},
        old: {},
    });

    console.log(exceptionAccessRefs.current.new);

    const getCoworkers = async () => {
        // get coworkers
        const response = await readCoworkerRules();
        if (response) {
            if (response == 'unauthorized') {
                return changeRoute('/login');
            }
        }

        console.log(response);
        setCoworkersState(response);
    };

    useEffect(() => {
        getCoworkers();
    }, []);

    const getCoworkerAccess = (coworkerUsername) => {
        const access = {};

        // this spagetty needs some clean up
        const userExceptions = exceptionAccessRefs.current.old[coworkerUsername];
        access.exception = Object.keys(userExceptions).reduce((acc, excObjKey) => {
            acc[excObjKey] = Object.keys(userExceptions[excObjKey]).reduce((acc, accessObjKey) => {
                acc[accessObjKey] = userExceptions[excObjKey][accessObjKey].defaultChecked;
                return acc;
            }, {});
            return acc;
        }, {});

        access.generic = Object.keys(genericAccessRefs.old[coworkerUsername]).reduce(
            (acc, objKey) => {
                acc[objKey] =
                    genericAccessRefs.current.old[coworkerUsername][objKey].defaultChecked;
                return acc;
            },
            {}
        );

        return access;
    };

    const addNewCoworker = (e) => {
        e.preventDefault();
        const generic = Object.keys(genericAccessRefs.current.new).reduce((acc, accessKey) => {
            acc[accessKey] = genericAccessRefs.current.new[accessKey].checked;
            return acc;
        }, {});
        const coworker = exceptionAccessRefs.current.new.coworkerUsername.value;

        //-I- check if the coworker exists, better to add coworkers by id and usernames like in discord
        if (coworkersState.generic[coworker]) {
            return console.log('this coworker already exists');
        }

        console.log(Object.values(exceptionAccessRefs.current.new?.old)[0]);
        const props = {
            coworker,
            generic,
            exceptions: Object.values(exceptionAccessRefs.current.new?.old)[0] ?? {},
        };
        createCoworkerRules({props});

        // clear the new coworker so there will be only one new coworker object
        exceptionAccessRefs.current.new.old = {};
        exceptionAccessRefs.current.new.new = {};

        //re-render
    };

    const showExceptionsPopUp = (coworker, oldOrNew, coworkerUsername) => {
        setPopUpState({...popUpState, showExceptions: true, coworker, oldOrNew, coworkerUsername});
    };

    const hidePopUp = () => {
        setPopUpState({...popUpState, showExceptions: false});
    };
    const listCoworkers = () =>
        coworkersState.generic ? (
            Object.keys(coworkersState.generic).map((coworkerUsername) => {
                //* a copy of the state keeps the doctor away
                // console.log(coworkersState.generic[coworkerUsername]);
                genericAccessRefs.current.old[coworkerUsername] = {
                    ...coworkersState.generic[coworkerUsername],
                };
                return (
                    <li key={coworkerUsername} className="mt-[1rem]">
                        <div className="flex gap-2">
                            <div>
                                <img src="" alt="" />
                                <span>{coworkerUsername}</span>
                            </div>
                            <AccessControl
                                ref={genericAccessRefs.current.old[coworkerUsername]}
                                coworkerAccess={coworkersState.generic[coworkerUsername]}
                            />

                            <button>Update</button>
                            <button>delete</button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    showExceptionsPopUp(
                                        {
                                            [coworkerUsername]:
                                                coworkersState.exceptions[coworkerUsername],
                                        },
                                        'old',
                                        coworkerUsername
                                    );
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

    return (
        <div className="container mt-[4rem]">
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="user"
                    ref={(el) => {
                        exceptionAccessRefs.current.new.coworkerUsername = el;
                    }}
                />
                <AccessControl ref={genericAccessRefs.current.new} />
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        const coworkerUsername =
                            exceptionAccessRefs.current.new.coworkerUsername.value ?? 'new user';
                        showExceptionsPopUp(
                            {
                                [coworkerUsername]: {},
                            },
                            'new',
                            coworkerUsername
                        );
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
            <div className="mt-[4rem]">
                <ul>{listCoworkers()}</ul>
            </div>
            {popUpState.showExceptions ? (
                <ExceptionsPopUp
                    ref={exceptionAccessRefs}
                    hidePopUp={hidePopUp}
                    coworker={popUpState.coworker}
                    oldOrNew={popUpState.oldOrNew}
                    coworkerUsername={popUpState.coworkerUsername}
                />
            ) : (
                <></>
            )}
        </div>
    );
}
