import React from 'react';
import {useNavigate, useOutletContext} from 'react-router';
import {useState} from 'react';
import {useRef} from 'react';
import ExceptionsPopUp from '../components/exceptionsPopUp';
import AccessControl from '../components/accessControl';
import {readCoworkerRules, getSnippets} from '../tools/snipStore';

import {create, remove, update} from '../tools/bridge';
import {useQuery} from 'react-query';

import {
    FaMinusSquare,
    FaFolderPlus,
    FaPuzzlePiece,
    FaMinusCircle,
    FaRegMinusSquare,
    FaArrowAltCircleUp,
    FaArrowCircleUp,
    FaRetweet,
    FaPlusSquare,
    FaHistory,
} from 'react-icons/fa';

export default function AddRules() {
    const navigate = useNavigate();

    const {whoami, notify} = useOutletContext();
    // if (whoami == '' || whoami == 'unauthorized') {
    //     console.log('redirecting');
    //     return navigate('/login', {replace: true});
    // }
    // console.log('whoami', whoami);

    const [_, setForceRenderState] = useState(false);

    const [popUpState, setPopUpState] = useState({showExceptions: false});

    const changedCoworkers = useRef(new Set([]));

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
        refetch,
    } = useQuery('coworkers', () => {
        return readCoworkerRules();
    });
    if (coworkersRulesErr?.req?.status == 401) {
        return navigate('/login', {replace: true});
    }
    // console.log('query coworkers', coworkersRulesData);

    // get snippets list
    const {
        data: snippetsData,
        status: snippetsStatus,
        error: snippetsErr,
    } = useQuery(['snippetsMeta'], () => {
        return getSnippets({user: whoami, meta: 'meta'});
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
            refetch();
        }
    };

    const addNewCoworker = async (e) => {
        eventDefaults(e);
        const generic = Object.keys(genericAccessRefs.current.new).reduce((acc, accessKey) => {
            acc[accessKey] = genericAccessRefs.current.new[accessKey].checked;
            return acc;
        }, {});

        const coworker = exceptionAccessRefs.current.new.coworkerUsername.value;

        const Excpts = exceptionAccessRefs.current.new?.old;
        const exceptions = popUpState.oldOrNew == 'new' ? Excpts ?? {} : Excpts?.[coworker] ?? {};

        //-I- check if the coworker exists, better to add coworkers by id and usernames like in discord
        if (coworkersRulesData.generic[coworker]) {
            notify({type: 'error', msg: 'this coworker already exists'});
            return;
        }

        // console.log('add new', exceptionAccessRefs.current.new?.old);
        const props = {
            coworker,
            generic,
            exceptions,
        };
        //wait fot the changes before getting the new data
        const response = await create(`coworkerRules`, {props});

        notify({type: 'info', msg: response.msg});

        if (response.status == 200) {
            // clear the new coworker so there will be only one new coworker object
            exceptionAccessRefs.current.new.old = {};
            exceptionAccessRefs.current.new.new = {};

            refetch();
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
            changedCoworkers.current.delete(coworkerUsername);
            refetch();
        }
    };

    const showExceptionsPopUp = (coworker, oldOrNew, coworkerUsername) => {
        // console.log(coworkersRulesData, coworker);
        setPopUpState({...popUpState, showExceptions: true, coworker, oldOrNew, coworkerUsername});
    };

    const markChangedCoworker = (coworkerUsername) => {
        changedCoworkers.current.add(coworkerUsername);
        setForceRenderState((old) => !old);
    };

    const hidePopUp = () => {
        // console.log('before hide popup', exceptionAccessRefs.current.new.old);
        setPopUpState({...popUpState, showExceptions: false});
    };

    const classes = {
        inputs: 'flex justify-between items-center mb-[2rem]',
        buttons: 'flex gap-5',
        button: 'border-2 border-primary px-2 py-1',
        iconButton: 'text-2xl text-primary tooltip',
        li: 'mb-2 px-3 py-2 border-2 border-[#323232] rounded-md hover:bg-[#262626]',
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
                    <li key={coworkerUsername} className={classes.li}>
                        <div className="flex justify-between items-center">
                            <div>
                                <img src="" alt="" />
                                <span>{coworkerUsername}</span>
                            </div>
                            <AccessControl
                                ref={genericAccessRefs.current.old[coworkerUsername]}
                                coworkerAccess={coworkersRulesData.generic[coworkerUsername]}
                                type="generic"
                                markChangedCoworker={(e) => {
                                    markChangedCoworker(coworkerUsername);
                                }}
                            />

                            <div className={classes.buttons}>
                                <button
                                    className={`${classes.iconButton} ${
                                        changedCoworkers.current.has(coworkerUsername)
                                            ? 'text-orange-400'
                                            : ''
                                    }`}
                                    onClick={(e) => {
                                        eventDefaults(e);
                                        updateCoworker(coworkerUsername);
                                    }}
                                >
                                    <div className="tooltiptext">Update rule</div>
                                    <FaRetweet />
                                </button>
                                <button
                                    className={classes.iconButton}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        showExceptionsPopUp(
                                            coworkersRulesData.exceptions[coworkerUsername],
                                            'old',
                                            coworkerUsername
                                        );
                                    }}
                                >
                                    <div className="tooltiptext">Exceptions</div>
                                    <FaFolderPlus />
                                    {/* <FaPuzzlePiece />
                                    <FaHistory /> */}
                                </button>
                                <button
                                    className={classes.iconButton}
                                    onClick={(e) => {
                                        eventDefaults(e);
                                        deleteCoworker(coworkerUsername);
                                    }}
                                >
                                    <div className="tooltiptext">Delete rule</div>
                                    <FaMinusSquare />
                                    {/* <FaMinusCircle />
                                    <FaRegMinusSquare /> */}
                                </button>
                            </div>
                        </div>
                    </li>
                );
            })
        ) : (
            <></>
        );

    return coworkersRulesStatus == 'success' && snippetsStatus == 'success' ? (
        <div className="container mt-[4rem]">
            <div className={classes.inputs}>
                <input
                    type="text"
                    placeholder="new Coworker"
                    ref={(el) => {
                        exceptionAccessRefs.current.new.coworkerUsername = el;
                    }}
                />
                <AccessControl ref={genericAccessRefs.current.new} type="generic" />
                <div className={classes.buttons}>
                    <button
                        className={classes.iconButton}
                        onClick={(e) => {
                            e.preventDefault();
                            const coworkerUsername =
                                exceptionAccessRefs.current.new.coworkerUsername.value ??
                                'new user';
                            showExceptionsPopUp({}, 'new', coworkerUsername);
                        }}
                    >
                        <div className="tooltiptext">Exceptions</div>
                        <FaFolderPlus />
                    </button>
                    <button className={classes.iconButton} onClick={addNewCoworker}>
                        <div className="tooltiptext">Add Rule</div>
                        <FaPlusSquare />
                    </button>
                </div>
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
                    markChangedCoworker={markChangedCoworker}
                />
            ) : (
                <></>
            )}
        </div>
    ) : (
        <></>
    );
}
