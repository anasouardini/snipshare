import React from 'react';
import {useNavigate, useOutletContext} from 'react-router';
import {useState} from 'react';
import {useRef} from 'react';
import ExceptionsPopUp from '../components/exceptionsPopUp';
import AccessControl from '../components/accessControl';
import {useEffect} from 'react';
import {readCoworkerRules, getSnippets} from '../tools/snipStore';

import {create, remove, update} from '../tools/bridge';
import {useQuery} from 'react-query';

export default function AddRules() {
    const navigate = useNavigate();

    const whoami = useOutletContext();
    // if (whoami == '' || whoami == 'unauthorized') {
    //     console.log('redirecting');
    //     return navigate('/login', {replace: true});
    // }
    // console.log('whoami', whoami);

    const [popUpState, setPopUpState] = useState({showExceptions: false});

    // list of checkboxes
    const genericAccessRefs = useRef({
        new: {},
        old: {},
    });

    const exceptionAccessRefs = useRef({
        new: {coworkerUsername: {}},
        old: {},
    });

    // console.log(exceptionAccessRefs.current);

    const {
        data: coworkersRulesData,
        status: coworkersRulesStatus,
        error: coworkersRulesErr,
    } = useQuery('coworkers', () => {
        return readCoworkerRules();
    });
    if (coworkersRulesErr?.req?.status == 401) {
        return navigate('/login', {replace: true});
    }
    // console.log(coworkersRulesData);

    // get snippets list
    const {
        data: snippetsData,
        status: snippetsStatus,
        error: snippetsErr,
    } = useQuery(['snippets'], () => {
        return getSnippets(whoami, 'meta');
    });
    if (snippetsErr?.req?.status == 401) {
        return navigate('/login', {replace: true});
    }

    const eventDefaults = (e) => {
        e.stopPropagation();
        e.preventDefault();
    };

    const deleteCoworker = async (coworkerUsername) => {
        //wait fot the changes before getting the new data
        const response = await remove(`coworkerRules`, {props: {coworker: coworkerUsername}});

        if (response.status == 200) {
            // updateRules();
        }
    };

    const addNewCoworker = async (e) => {
        eventDefaults(e);
        const generic = Object.keys(genericAccessRefs.current.new).reduce((acc, accessKey) => {
            acc[accessKey] = genericAccessRefs.current.new[accessKey].checked;
            return acc;
        }, {});
        const coworker = exceptionAccessRefs.current.new.coworkerUsername.value;

        //-I- check if the coworker exists, better to add coworkers by id and usernames like in discord
        if (coworkersRulesData.generic[coworker]) {
            return console.log('this coworker already exists');
        }

        // console.log(Object.values(exceptionAccessRefs.current.new?.old)[0]);
        const props = {
            coworker,
            generic,
            exceptions: Object.values(exceptionAccessRefs.current.new?.old ?? {key: {}})[0] ?? {},
        };
        //wait fot the changes before getting the new data
        const response = await create(`coworkerRules`, {props});

        console.log(response);
        if (response.status == 200) {
            // clear the new coworker so there will be only one new coworker object
            exceptionAccessRefs.current.new.old = {};
            exceptionAccessRefs.current.new.new = {};

            //re-render
            // updateRules();
        }
    };

    const updateCoworker = async (coworkerUsername) => {
        const generic = Object.keys(genericAccessRefs.current.old[coworkerUsername]).reduce(
            (acc, accessKey) => {
                acc[accessKey] = genericAccessRefs.current.old[coworkerUsername][accessKey].checked;
                return acc;
            },
            {}
        );

        const props = {
            coworker: coworkerUsername,
            generic,
            exceptions:
                exceptionAccessRefs.current.old?.old?.[coworkerUsername] ??
                coworkersRulesData.exceptions[coworkerUsername],
        };
        // console.log(props);
        const response = await update(`coworkerRules`, {props});

        if (response.status == 200) {
            //re-render
            // updateRules();
        }
    };

    const showExceptionsPopUp = (coworker, oldOrNew, coworkerUsername) => {
        setPopUpState({...popUpState, showExceptions: true, coworker, oldOrNew, coworkerUsername});
    };

    const hidePopUp = () => {
        setPopUpState({...popUpState, showExceptions: false});
    };

    const listCoworkers = () =>
        coworkersRulesData.generic ? (
            Object.keys(coworkersRulesData.generic).map((coworkerUsername) => {
                //* a copy of the state keeps the doctor away
                // console.log(coworkersRulesData.generic[coworkerUsername]);
                genericAccessRefs.current.old[coworkerUsername] = {
                    ...coworkersRulesData.generic[coworkerUsername],
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
                                coworkerAccess={coworkersRulesData.generic[coworkerUsername]}
                                type="generic"
                            />

                            <button
                                onClick={(e) => {
                                    eventDefaults(e);
                                    updateCoworker(coworkerUsername);
                                }}
                            >
                                Update
                            </button>
                            <button
                                onClick={(e) => {
                                    eventDefaults(e);
                                    deleteCoworker(coworkerUsername);
                                }}
                            >
                                delete
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    showExceptionsPopUp(
                                        {
                                            [coworkerUsername]:
                                                coworkersRulesData.exceptions[coworkerUsername],
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

    return coworkersRulesStatus == 'success' && snippetsStatus == 'success' ? (
        <div className="container mt-[4rem]">
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="user"
                    ref={(el) => {
                        exceptionAccessRefs.current.new.coworkerUsername = el;
                    }}
                />
                <AccessControl ref={genericAccessRefs.current.new} type="generic" />
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
                    snippets={snippetsData.snippets}
                />
            ) : (
                <></>
            )}
        </div>
    ) : (
        <></>
    );
}
