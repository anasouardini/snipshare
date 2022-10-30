import React from 'react';
import {useEffect} from 'react';
import {useRef} from 'react';
import {forwardRef} from 'react';
import {useState} from 'react';
import AccessControl from '../components/accessControl';
import {deepClone} from '../tools/deepClone';

const ExceptionsPopUp = forwardRef((props, ref) => {
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
                    old: {[props.coworkerUsername]: {...props.coworker}},
                };
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
            return console.log('snippet already exists');
        }

        // this passes the access intermediate values to <accessControl/>
        // then it's used a references obj the dom checkboxes
        coworkerExceptionsRef.current[exceptionID] = Object.keys(
            parentRef.new.exceptionAccess
        ).reduce((acc, accessKey) => {
            acc[accessKey] = parentRef.new.exceptionAccess[accessKey].checked;
            return acc;
        }, {});

        // console.log(ref.current[props.oldOrNew].old);
        // console.log(coworkerExceptionsRef);

        forceRerender();
    };

    console.log(ref.current[props.oldOrNew].old);
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
            ref.current[props.oldOrNew].old = deepClone(coworkerExceptionsRef.current); //- this works
        } else {
            ref.current[props.oldOrNew].old[props.coworkerUsername] = deepClone(
                coworkerExceptionsRef.current
            ); //- this works
        }
        // coworkerExceptionsRef.current = deepClone(coworkerExceptionsRef.current); //- this doesn't

        // console.log(coworkerExceptionsRef.current);
        // console.log('handle close', ref.current[props.oldOrNew].old);

        // unmount pop-up
        // forceRerender();
        props.hidePopUp();
        console.log();
    };

    // console.log(ref.current);
    // console.log(coworkerExceptionsRef.current);

    const listExceptions = () =>
        ref.current[props.oldOrNew].old ? (
            Object.keys(coworkerExceptionsRef.current).map((exceptionID) => {
                return (
                    <li key={exceptionID}>
                        <div className="flex gap-4">
                            <div>{exceptionID}</div>
                            <AccessControl
                                ref={coworkerExceptionsRef.current[exceptionID]}
                                coworkerAccess={coworkerExceptionsRef.current[exceptionID]}
                                type="exceptions"
                            />

                            <button
                                onClick={(e) => {
                                    eventDefaults(e);
                                    delete coworkerExceptionsRef.current[exceptionID];
                                    forceRerender();
                                }}
                            >
                                delete
                            </button>
                        </div>
                    </li>
                );
            })
        ) : (
            <></>
        );

    const snippetsDataList = () => {
        return (
            // <datalis id="snippets">
            <select
                className="bg-[#282828]"
                id="snippets"
                ref={(el) => {
                    ref.current[props.oldOrNew].new.exceptionID = el;
                }}
            >
                {props.snippets.map((snippet) => {
                    return (
                        <option key={snippet.id} value={snippet.id}>
                            {snippet.title}
                        </option>
                    );
                })}
            </select>
            // </datalis>
        );
    };

    return (
        <div className={`z-10 fixed top-0 left-0 w-full h-full flex items-center justify-center`}>
            <div
                onClick={handleClose}
                className={`fixed content-[""] top-0 left-0
                w-full h-full bg-lime-600 opacity-20`}
            ></div>
            <form className="flex flex-col w-[600px] gap-6 p-6 pt-8 bg-[#181818] z-30 drop-shadow-2xl relative">
                <span
                    onClick={handleClose}
                    className='absolute content-["X"] top-2 right-2 text-xl cursor-pointer text-gray-700'
                >
                    X
                </span>

                <div>
                    <h1 className="mb-[4rem] text-2xl text-center">
                        Managing {props.coworkerUsername}'s Rules
                    </h1>
                    <div className="flex gap-4">
                        {ref.current[props.oldOrNew].new ? (
                            <>
                                {snippetsDataList()}
                                {/* <input
                                    type="text"
                                    placeholder="snippet"
                                    ref={(el) => {
                                        ref.current[props.oldOrNew].new.exceptionID = el;
                                    }}
                                    list="snippets"
                                /> */}
                                <AccessControl
                                    ref={ref.current[props.oldOrNew].new.exceptionAccess}
                                    type="exceptions"
                                />
                            </>
                        ) : (
                            <></>
                        )}
                        <button
                            className="border-1-lime border-radius-[50%] text-xl"
                            onClick={addNewException}
                        >
                            +
                        </button>
                    </div>
                    <div>
                        <ul>{listExceptions()}</ul>
                    </div>
                </div>

                <button
                    className="w-[100px] bg-lime-600 leading-8 rounded-md text-white mx-auto"
                    onClick={handleClose}
                >
                    Save
                </button>
            </form>
        </div>
    );
});

export default ExceptionsPopUp;
