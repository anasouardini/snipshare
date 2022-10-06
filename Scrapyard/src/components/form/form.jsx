import React, {useState, useEffect, useRef} from 'react';
import {create, read, update} from '../../tools/bridge';
import {deepClone} from '../../tools/deepClone';
import {Bridge} from '../../tools/stateBridge';
import Coworkers from './fields/coworkers';
import IsPrivate from './fields/isPrivate';

export default function Form(props) {
    const [coworkerState, setCoworkerState] = useState({coworkers: {}});
    const [parentStates, setParentStates] = useState(Bridge.getState(props.id, '*'));

    const refs = {
        title: useRef('title'),
        descr: useRef('descr'),
        snippet: useRef('snippet'),
        isPrivate: useRef(true),
    };

    const handleClose = (e) => {
        e.stopPropagation();
        // unmount form
        Bridge.setState(props.id, 'popUpState', {showForm: false, showPreview: false});
    };

    const handleEdit = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        const body = {
            props: {
                id: props.snippetID,
                title: refs.title.current.value,
                descr: refs.descr.current.value,
                snippet: refs.snippet.current.value,
            },
        };
        const response = await update(props.user + '/' + props.snippetID, body);
        console.log(response.msg);

        if (response.status == 200) {
            props.updateItems(props.user);
        }

        // unmount form
        Bridge.setState(props.id, 'popUpState', {showForm: true, showPreview: false});
    };

    const handleCreate = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        const body = {
            props: {
                user: parentStates.snipInfoState.user,
                title: refs.title.current.value,
                descr: refs.descr.current.value,
                snippet: refs.snippet.current.value,
                coworker: coworkerState.coworkers,
                isPrivate: refs.isPrivate.current.checked,
            },
        };

        const response = await create(`${parentStates.snipInfoState.user}/snippet`, body);

        console.log(response);

        // unmount form
        Bridge.setState(props.id, 'popUpState', {showForm: true, showPreview: false});

        if (response && response.status == 200) {
            const children = await updateItems(props.user);
            if (children.err == 'unauthorised') {
                return changeRoute('/login');
            }

            if (children.err == 'fetchError') {
                return;
            }

            Bridge.setState(props.id, 'snipInfoState', {
                whoami: parentStates.snipInfoState.whoami,
                children: [],
            });
        }
    };

    useEffect(() => {
        const bridges = {
            coworkerState: {
                state: coworkerState,
                render: (newState = undefined) => {
                    let newStateCpy = newState ?? state;
                    setCoworkerState(newStateCpy);
                },
            },
        };
        Bridge.initBridge('form', bridges);
    }, []);

    const listInputs = (inputsArr = []) => {
        // await Promise.all[
        return inputsArr.map((input) => {
            // let Component = '';
            // (async () => {
            // Component = await import(`./fields/${input.type}`);
            // console.log(Component);
            const Component = input.type;
            return <Component {...input.attr} />;
            // })();
        });
        // ];
    };

    // console.log(listInputs(props.fields));

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
                {listInputs(props.fields)}

                <button
                    className="w-[100px] bg-lime-600 leading-8 rounded-md text-white mx-auto"
                    onClick={props.action == 'edit' ? handleEdit : handleCreate}
                >
                    {props.action == 'edit' ? 'Edit' : 'Create'}
                </button>
            </form>
        </div>
    );
}
