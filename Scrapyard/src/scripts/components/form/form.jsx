import React, {useRef} from 'react';
import {useContext} from 'react';
import {GlobalContext} from '../../pages/shared/sharedLayout';
import {create, read, update} from '../../tools/bridge';
import {getIsPrivate, getSnipCode} from '../../tools/snipStore';
import fieldsMap from './fieldsMap';

export default function Form(props) {
    const whoami = useContext(GlobalContext);
    const refs = {
        title: useRef('title'),
        descr: useRef('descr'),
    };

    const handleClose = (e) => {
        e.stopPropagation();
        // unmount form
        props.hidePopUp('form');
    };

    const createRequestBody = () => {
        // create and edit request
        const snipProps = {
            title: refs.title.current.value,
            descr: refs.descr.current.value,
            snippet: getSnipCode(),
            isPrivate: getIsPrivate(),
        };
        const body = {props: {}};

        console.log(snipProps);
        props.fields.forEach((field) => {
            console.log(snipProps[field.attr.key]);

            // keept the != undefined, because js is stupid
            if (snipProps?.[field.attr.key] != undefined) {
                body.props[field.attr.key] = snipProps[field.attr.key];
            }
        });
        console.log(body);
        return body;
    };

    const handleEdit = async () => {
        const response = await update(props.snipUser + '/' + props.snipId, {
            user: props.snipUser,
            ...createRequestBody(),
        });
        console.log(response);

        props.hidePopUp('form');

        if (response.status == 200) {
            props.updateSnippetsCB();
        }
    };

    const handleCreate = async () => {
        const response = await create(`${whoami}/snippet`, createRequestBody());
        console.log(response);

        props.hidePopUp('form');

        if (response.status == 200) {
            props.updateSnippetsCB();
        }
    };

    const handleSubmit = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (props.action == 'edit') {
            return handleEdit();
        }
        handleCreate();
    };

    // listing form fields
    const listInputs = (fields = []) => {
        return fields.map((input) => {
            const Component = fieldsMap(input.type);
            return <Component ref={refs[input?.attr?.key]} {...input.attr} />;
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
