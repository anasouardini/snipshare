import React, {forwardRef, useState, useRef, useEffect} from 'react';
import AccessControl from '../components/accessControl';
import {deepClone} from '../tools/deepClone';
import {FaPlusSquare, FaMinusSquare} from 'react-icons/fa';
import {useOutletContext} from 'react-router';
import {useQuery} from 'react-query';
import {getSnippets} from '../tools/snipStore';
import debouncer from '../tools/debouncer';

const ExceptionsPopUp = (props, ref) => {
    const {notify, whoami} = useOutletContext();

    const [_, setForceRenderState] = useState(true);
    const forceRerender = () => {
        setForceRenderState((old) => !old);
    };

    // DRYing a little
    const coworkerExceptionsRef = useRef({});
    // console.log(coworkerExceptionsRef);
    useEffect(() => {
        // console.log('initial ref', ref.current);

        if (props.oldOrNew == 'new') {
            if (!ref.current[props.oldOrNew]?.old) {
                ref.current[props.oldOrNew] = {
                    //* a copy of the state keeps the doctor away
                    old: {...props.coworker},
                };
            }

            coworkerExceptionsRef.current = ref.current[props.oldOrNew].old;
        } else {
            if (!ref.current[props.oldOrNew]?.old) {
                ref.current[props.oldOrNew] = {
                    // get the old rules for this old coworker
                    old: {[props.coworkerUsername]: {...props.coworker}},
                };
            }
            // if the old coworker is already edited, don't overwrite the old new rules
            else if (!ref.current[props.oldOrNew]?.old?.[props.coworkerUsername]) {
                ref.current[props.oldOrNew].old[props.coworkerUsername] = props.coworker;
            }
            coworkerExceptionsRef.current = ref.current[props.oldOrNew].old[props.coworkerUsername];
            // console.log('ref', ref.current[props.oldOrNew].old);
        }

        // console.log('coworker', props.coworker);
        ref.current[props.oldOrNew].new = {exceptionID: {}, exceptionAccess: {}};
        // console.log('ref ref', ref.current);

        forceRerender();

        // return () => {
        //     console.log('ref ref', deepClone(ref.current[props.oldOrNew].old));
        //     console.log();
        // };
    }, []);

    const eventDefaults = (e) => {
        e.stopPropagation();
        e.preventDefault();
    };

    const addNewException = (e) => {
        eventDefaults(e);

        const parentRef = ref.current[props.oldOrNew];

        const exceptionID = parentRef.new.exceptionID.value;

        if (coworkerExceptionsRef.current?.[exceptionID]) {
            notify({type: 'error', msg: 'this exception already exists'});
            return;
        }

        // this passes the access intermediate values to <accessControl/>
        // then it's used a references obj the dom checkboxes
        coworkerExceptionsRef.current[exceptionID] = Object.keys(
            parentRef.new.exceptionAccess
        ).reduce((acc, accessKey) => {
            acc[accessKey] = parentRef.new.exceptionAccess[accessKey].checked;
            return acc;
        }, {});

        // add coworker to the ref of set of changed coworkers in coworkerRules
        props.markChangedCoworker(props.coworkerUsername);

        // console.log(ref.current[props.oldOrNew].old);
        // console.log(coworkerExceptionsRef);

        forceRerender();
    };

    // console.log(ref.current[props.oldOrNew].old);
    const handleClose = (e) => {
        eventDefaults(e);

        Object.keys(coworkerExceptionsRef.current).forEach((exceptionID) => {
            Object.keys(coworkerExceptionsRef.current[exceptionID]).forEach((access) => {
                coworkerExceptionsRef.current[exceptionID][access] =
                    coworkerExceptionsRef.current[exceptionID][access].checked;
            });
        });

        // the `coworkerExceptionsRef` is now referencing dom elements instead of ref.current...

        //! not knowing how this works is dangerous
        if (props.oldOrNew == 'new') {
            //- this works
            ref.current[props.oldOrNew].old = deepClone(coworkerExceptionsRef.current);
        } else {
            ref.current[props.oldOrNew].old[props.coworkerUsername] = deepClone(
                coworkerExceptionsRef.current
            ); //- this works
        }

        //- this doesn't
        // coworkerExceptionsRef.current = deepClone(coworkerExceptionsRef.current);

        // console.log(coworkerExceptionsRef.current);
        // console.log('handle close', ref.current[props.oldOrNew].old);

        // unmount pop-up
        // forceRerender();
        props.hidePopUp();
    };

    // console.log(ref.current);
    // console.log(coworkerExceptionsRef.current);
    const classes = {
        inputs: 'flex justify-between items-center mb-[2rem] flex-wrap gap-5',
        ruleItem: 'flex justify-between items-center gap-5 flex-wrap',
        buttons: 'flex gap-5',
        iconButton: 'text-2xl text-primary tooltip',
        li: 'mb-2 px-3 py-2 border-2 border-[#323232] rounded-md hover:bg-[#262626]',
    };

    const listExceptions = () =>
        ref.current[props.oldOrNew].old ? (
            Object.keys(coworkerExceptionsRef.current).map((exceptionID) => {
                return (
                    <li key={exceptionID} className={classes.li}>
                        <div className={classes.ruleItem}>
                            <div className='truncate w-[10rem]'>{exceptionID}</div>
                            <AccessControl
                                ref={coworkerExceptionsRef.current[exceptionID]}
                                coworkerAccess={coworkerExceptionsRef.current[exceptionID]}
                                type='exceptions'
                                markChangedCoworker={() => {
                                    props.markChangedCoworker(props.coworkerUsername);
                                }}
                            />

                            <button
                                className={classes.iconButton}
                                onClick={(e) => {
                                    eventDefaults(e);
                                    delete coworkerExceptionsRef.current[exceptionID];
                                    props.markChangedCoworker(props.coworkerUsername);
                                    forceRerender();
                                }}
                            >
                                <div className='tooltiptext'>Delete Exception</div>
                                <FaMinusSquare />
                            </button>
                        </div>
                    </li>
                );
            })
        ) : (
            <></>
        );

    // get snippets list
    const {
        data: snippetsData,
        status: snippetsStatus,
        refetch: refetchSnippets,
    } = useQuery(['snippetsMeta'], () => {
        return getSnippets({
            user: whoami,
            meta: 'meta',
            title: ref.current[props.oldOrNew].new.exceptionID.value,
            pageParam: 1,
            perPage: 6,
        });
    });

    useEffect(() => {
        debouncer.init(
            'exceptionsSearch',
            () => {
                refetchSnippets();
            },
            500
        );
    }, []);

    const handleSnippetSearch = () => {
        debouncer.run('exceptionsSearch');
    };

    const snippetsDataList = () => {
        // console.log(snippetsData);
        return (
            <>
                <input
                    onChange={handleSnippetSearch}
                    list='snippets'
                    type='text'
                    ref={(el) => {
                        ref.current[props.oldOrNew].new.exceptionID = el;
                    }}
                />
                <datalist id='snippets'>
                    {snippetsData.snippets.map((snippet) => {
                        return (
                            <option key={snippet.id} value={snippet.id}>
                                {snippet.title}
                            </option>
                        );
                    })}
                </datalist>
            </>
        );
    };

    return (
        <div
            className={`backdrop-blur-sm z-10 fixed top-0 left-0
                      w-full h-full flex items-center justify-center`}
        >
            <div
                onClick={handleClose}
                className={`fixed content-[""] top-0 left-0
                            w-full h-full`}
            ></div>
            <form
                className='flex flex-col w-[600px] gap-6 p-6 pt-8
                        bg-[#181818] z-30 drop-shadow-2xl relative'
            >
                <span
                    onClick={handleClose}
                    className='text-primary absolute content-["X"] top-2
                              right-2 text-xl cursor-pointer'
                >
                    X
                </span>

                <div>
                    <h1 className='mb-[4rem] text-2xl text-center'>
                        Managing {props.coworkerUsername}&apos;s Rules
                    </h1>
                    <div className={classes.inputs}>
                        {ref.current[props.oldOrNew].new && snippetsStatus == 'success' ? (
                            <>
                                {snippetsDataList()}
                                <AccessControl
                                    ref={ref.current[props.oldOrNew].new.exceptionAccess}
                                    type='exceptions'
                                />
                            </>
                        ) : (
                            <></>
                        )}

                        <button className={classes.iconButton} onClick={addNewException}>
                            <FaPlusSquare className='' />
                            <div className='tooltiptext'>Add Exception</div>
                        </button>
                    </div>
                    <div>
                        <ul>{listExceptions()}</ul>
                    </div>
                </div>

                {/* <button
                    className="w-[100px] bg-primary leading-8 rounded-md text-white mx-auto"
                    onClick={handleClose}
                >
                    Save
                </button> */}
            </form>
        </div>
    );
};

export default forwardRef(ExceptionsPopUp);
