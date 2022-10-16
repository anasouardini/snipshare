import React from 'react';
import {useEffect} from 'react';
import {forwardRef} from 'react';
import {useState} from 'react';
import AccessControl from '../components/accessControl';
import {deepClone} from '../tools/deepClone';

const ExceptionsPopUp = forwardRef((props, ref) => {
    const [_, setForceRenderState] = useState(true);
    const forceRerender = () => {
        setForceRenderState((old) => !old);
    };

    useEffect(() => {
        const coworkerExceptions = props.coworker[props.coworkerUsername]; // empty obj in case of a new coworker
        //* a copy of the state keeps the doctor away
        if (!ref.current[props.oldOrNew]?.old?.[props.coworkerUsername]) {
            ref.current[props.oldOrNew] = {
                old: {[props.coworkerUsername]: {...coworkerExceptions}},
                new: {exceptionID: {}, exceptionAccess: {}},
            };
        }
        forceRerender();
    }, []);

    const eventDefaults = (e) => {
        e.stopPropagation();
        e.preventDefault();
    };

    const addNewException = (e) => {
        eventDefaults(e);
        const parentRef = ref.current[props.oldOrNew];

        const exceptions = parentRef.old[props.coworkerUsername];

        const exceptionID = parentRef.new.exceptionID.value;
        exceptions[exceptionID] = parentRef.new.exceptionAccess;

        console.log(ref.current[props.oldOrNew]);

        forceRerender();
    };

    const handleClose = (e) => {
        eventDefaults(e);

        //TODO: parse dom values
        const userOldExceptions = ref.current[props.oldOrNew].old[props.coworkerUsername];
        Object.keys(userOldExceptions).forEach((exceptionID) => {
            Object.keys(userOldExceptions[exceptionID]).forEach((access) => {
                userOldExceptions[exceptionID][access] =
                    userOldExceptions[exceptionID][access].checked;
            });
        });

        //! this potential memory leak is because of react not me
        ref.current[props.oldOrNew].old[props.coworkerUsername] = deepClone(userOldExceptions);

        // unmount pop-up
        props.hidePopUp();
    };

    const listExceptions = () =>
        ref.current[props.oldOrNew].old ? (
            Object.keys(ref.current[props.oldOrNew].old[props.coworkerUsername]).map(
                (exceptionID) => {
                    return (
                        <li key={exceptionID}>
                            <div className="flex gap-4">
                                <div>{exceptionID}</div>
                                <AccessControl
                                    ref={
                                        ref.current[props.oldOrNew].old[props.coworkerUsername][
                                            exceptionID
                                        ]
                                    }
                                />

                                <button
                                    onClick={(e) => {
                                        eventDefaults(e);
                                        delete ref.current[props.oldOrNew].old[
                                            props.coworkerUsername
                                        ][exceptionID];
                                        forceRerender();
                                    }}
                                >
                                    delete
                                </button>
                            </div>
                        </li>
                    );
                }
            )
        ) : (
            <></>
        );

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
                                <input
                                    type="text"
                                    placeholder="snippet"
                                    ref={(el) => {
                                        ref.current[props.oldOrNew].new.exceptionID = el;
                                    }}
                                />
                                <AccessControl
                                    ref={ref.current[props.oldOrNew].new.exceptionAccess}
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
                    Done
                </button>
            </form>
        </div>
    );
});

export default ExceptionsPopUp;
