import React, {useState, useEffect, useRef} from 'react';
import {create, read, update} from '../../tools/bridge';
import {getCoworkers, getIsPrivate, getWhoami} from '../../tools/snipStore';
import fieldsMap from './fieldsMap';

export default function Form(props) {
    const refs = {
        title: useRef('title'),
        descr: useRef('descr'),
        snippet: useRef('snippet'),
    };

    const handleClose = (e) => {
        e.stopPropagation();
        // unmount form
        props.hidePopUp('form');
    };

    const handleSubmit = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (props.action == 'edit') {
            return handleEdit();
        }
        handleCreate();
    };

    const handleEdit = async () => {
        const body = {
            props: {
                id: props.id,
                title: refs.title.current.value,
                descr: refs.descr.current.value,
                snippet: refs.snippet.current.value,
            },
        };
        const response = await update(getWhoami() + '/' + props.id, body);
        console.log(response.msg);

        if (response.status == 200) {
            const newSnippet = await updateSnippet(props.id);
            if (newSnippet.err == 'unauthorised') {
                return changeRoute('/login');
            }

            if (newSnippet.err == 'fetchError') {
                return;
            }

            props.updateSnippetCB();
        }

        // unmount form
        props.hidePopUp('form');
    };

    const handleCreate = async () => {
        const body = {
            props: {
                user: getWhoami(),
                title: refs.title.current.value,
                descr: refs.descr.current.value,
                snippet: refs.snippet.current.value,
                coworkers: getCoworkers(),
                isPrivate: getIsPrivate(),
            },
        };

        const response = await create(`${getWhoami()}/snippet`, body);

        console.log(response);

        // unmount form
        props.hidePopUp('form');
        props.updateSnippetsCB();
    };

    const listInputs = (inputsArr = []) => {
        return inputsArr.map((input) => {
            const Component = fieldsMap(input.type);
            return <Component ref={refs[input.attr.key]} {...input.attr} />;
        });
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
                {listInputs(props.fields)}

                <button
                    className="w-[100px] bg-lime-600 leading-8 rounded-md text-white mx-auto"
                    onClick={handleSubmit}
                >
                    {props.action == 'edit' ? 'Edit' : 'Create'}
                </button>
            </form>
        </div>
    );
}