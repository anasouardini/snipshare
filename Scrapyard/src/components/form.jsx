import React from 'react';
import {useRef} from 'react';
import {update} from '../tools/bridge';

export default function Form(props) {
    const refs = {
        title: useRef('title'),
        descr: useRef('descr'),
        snippet: useRef('snippet'),
    };

    const handleEdit = async () => {
        const body = {
            props: {
                id: props.snippetID,
                title: refs.title.current.value,
                descr: refs.descr.current.value,
                snippet: refs.snippet.current.value,
            },
        };
        await update(props.user + '/' + props.snippetID, body);
        props.updateItems();
    };

    const classes = {
        inputs: 'border-b-2 border-b-lime-600 p-1 outline-lime-300 focus:outline-1 text-gray-700',
    };

    return (
        <div
            className={`z-10 fixed top-0 left-0 w-full h-full flex items-center justify-center
                        before:fixed before:content-[""] before:top-0 before:left-0
                        before:w-full before:h-full before:bg-lime-600 before:opacity-20`}
        >
            <form className="flex flex-col w-[600px] gap-6 p-6 pt-8 bg-white z-30 drop-shadow-2xl relative before:fixed before:content-['X'] before:top-2 before:right-2 before:text-xl before:cursor-pointer">
                <input
                    ref={refs.title}
                    placeholder="title"
                    defaultValue={props.inputs.title}
                    type="text"
                    name="title"
                    className={classes.inputs}
                />
                <textarea
                    ref={refs.descr}
                    placeholder="description"
                    defaultValue={props.inputs.descr}
                    type="text"
                    name="descr"
                    className={classes.inputs}
                />
                <textarea
                    ref={refs.snippet}
                    placeholder="snippet"
                    defaultValue={props.inputs.snippet}
                    type="text"
                    name="snippet"
                    className={classes.inputs}
                />

                <button
                    className="w-[100px] bg-lime-600 leading-8 rounded-md text-white mx-auto"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleEdit();
                    }}
                >
                    Edit
                </button>
            </form>
        </div>
    );
}
