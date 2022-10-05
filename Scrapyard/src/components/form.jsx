import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {useRef} from 'react';
import {create, read, update} from '../tools/bridge';
import {deepClone} from '../tools/deepClone';

export default function Form(props) {
    const [coworkerState, setCoworkerState] = useState({coworkers: {}});
    const [usresState, setUsersState] = useState([]);

    const refs = {
        title: useRef('title'),
        descr: useRef('descr'),
        snippet: useRef('snippet'),
        isPrivate: useRef(true),
        coworker: useRef('noUser'),
        actions: {read: useRef(true), edit: useRef(true), delete: useRef(true)},
    };

    const handleClose = (e) => {
        e.stopPropagation();
        props.closePopUp();
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
            props.updateItems();
        }

        props.closePopUp();
    };

    const handleCreate = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        const body = {
            props: {
                user: props.user,
                title: refs.title.current.value,
                descr: refs.descr.current.value,
                snippet: refs.snippet.current.value,
                coworker: coworkerState.coworkers,
                isPrivate: refs.isPrivate.current.checked,
            },
        };

        const response = await create(`${props.user}/snippet`, body);

        console.log(response);
        if (response && response.status == 200) {
            props.updateItems();
        }

        props.closePopUp();
    };

    useEffect(() => {
        (async () => {
            const response = await read(`users`);

            if (response) {
                // console.log('fetching');
                console.log(response);
                if (response.status == 200) {
                    setUsersState(response.msg);
                }
            }
        })();
    }, []);

    const loadUsers = () => {
        return usresState.map((usr) => (
            <option key={usr} name={usr}>
                {usr}
            </option>
        ));
    };

    const handleAddCoworker = (e) => {
        e.stopPropagation();
        e.preventDefault();

        const coworkerActions = [];
        Object.keys(refs.actions).forEach((objKey) => {
            if (refs.actions[objKey].current.checked) {
                coworkerActions.push(objKey);
            }
        });
        const coworker = {user: refs.coworker.current.value, actions: coworkerActions};

        const stateClone = deepClone(coworkerState);
        stateClone.coworkers[refs.coworker.current.value] = coworker;
        setCoworkerState(stateClone);
    };
    const creationSpecifiInputs = () => {
        return (
            <>
                <label>
                    <input className="mr-1" ref={refs.isPrivate} type="checkbox" />
                    private
                </label>
                <h2>add co-workers</h2>

                <div className="">
                    <select
                        className="inline border-2 border-lime-300 bg-[#181818]"
                        ref={refs.coworker}
                        name="coworkers"
                    >
                        {loadUsers()}
                    </select>
                    <div className="inline">
                        <label className="ml-3">
                            <input
                                className="mr-1"
                                ref={refs.actions.read}
                                type="checkbox"
                                name="read"
                            />
                            read
                        </label>
                        <label className="ml-3">
                            <input
                                className="mr-1"
                                ref={refs.actions.edit}
                                type="checkbox"
                                name="edit"
                            />
                            edit
                        </label>
                        <label className="ml-3">
                            <input
                                className="mr-1"
                                ref={refs.actions.delete}
                                type="checkbox"
                                name="delete"
                            />
                            delete
                        </label>
                    </div>
                    <button
                        className="ml-2 px-2 float-right border-b-2 border-b-lime-300 p-1"
                        onClick={handleAddCoworker}
                    >
                        Add
                    </button>
                    <br />
                    <br />

                    {Object.keys(coworkerState.coworkers).length ? (
                        <ul>
                            {Object.keys(coworkerState.coworkers).map((coworker) => {
                                return (
                                    <li>
                                        <span>{coworker}: &nbsp;</span>
                                        {coworkerState.coworkers[coworker].actions.map((act) => (
                                            <span className="text-gray-600">{act} &nbsp;</span>
                                        ))}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <></>
                    )}
                </div>
            </>
        );
    };

    const classes = {
        inputs: 'border-b-2 border-b-lime-600 p-1 outline-lime-300 focus:outline-1 bg-[#181818]',
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
                <input
                    ref={refs.title}
                    placeholder="title"
                    defaultValue={props.action == 'edit' ? props.inputs.title : ''}
                    type="text"
                    name="title"
                    className={classes.inputs}
                />
                <textarea
                    ref={refs.descr}
                    placeholder="description"
                    defaultValue={props.action == 'edit' ? props.inputs.descr : ''}
                    type="text"
                    name="descr"
                    className={classes.inputs}
                />
                <textarea
                    ref={refs.snippet}
                    placeholder="snippet"
                    defaultValue={props.action == 'edit' ? props.inputs.snippet : ''}
                    type="text"
                    name="snippet"
                    className={classes.inputs}
                />

                {props.action == 'create' ? creationSpecifiInputs() : <p>heeeeeeeeee</p>}

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
