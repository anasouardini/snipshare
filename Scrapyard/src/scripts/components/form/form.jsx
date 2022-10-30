import React, {useRef} from 'react';
// import {useOutletContext} from 'react-router-dom';

import {create, update} from '../../tools/bridge';
import fieldsMap from './fieldsMap';

export default function Form(props) {
    // const whoami = useOutletContext();

    const refs = {
        title: useRef(''),
        descr: useRef(''),
        snippet: useRef(''),
        isPrivate: useRef(''),
    };

    const handleClose = (e) => {
        e.stopPropagation();
        // unmount form
        props.hidePopUp('form');
    };

    const createRequestBody = () => {
        const body = {props: {}};

        // console.log(props.fields);
        props.fields.forEach((field) => {
            const fieldKey = field.attr.key;
            // keept the != undefined, because js is weird
            if (refs?.[fieldKey] != undefined) {
                if (field.attr.type == 'checkbox') {
                    // console.log('fieldtype', refs[fieldKey].current.checked);
                    body.props[fieldKey] = refs[fieldKey].current.checked;
                } else if (field.attr.type == 'snippet') {
                    body.props[fieldKey] = refs[fieldKey].current.getValue();
                    // console.log(body.props[fieldKey]);
                } else {
                    // console.log(refs[fieldKey].current);
                    body.props[fieldKey] = refs[fieldKey].current.value;
                }
            }
        });

        console.log(body);
        return body;
    };

    const handleEdit = async () => {
        // createRequestBody();

        const response = await update(props.snipUser + '/' + props.snipId, {
            user: props.snipUser,
            ...createRequestBody(),
        });
        console.log(response);

        props.updateEditedSnippet();
    };

    const handleCreate = async () => {
        console.log(props.owner);
        const response = await create(`${props.owner}/snippet`, createRequestBody());
        console.log(response);
    };

    const handleSubmit = (e) => {
        e.stopPropagation();
        e.preventDefault();

        props.hidePopUp('form');

        if (props.action == 'edit') {
            return handleEdit();
        }
        handleCreate();
    };

    // console.log(Object.values(props.fields)[2].attr);
    // listing form fields
    const listInputs = (fields = []) => {
        return fields.map((input) => {
            const Component = fieldsMap(input.type);
            if (input.attr.key == 'descr') {
                const descrHeight = input.attr.defaultValue.split(/\r\n|\r|\n/).length * 42;
                // console.log(descrHeight);
                return (
                    <Component
                        ref={refs[input?.attr?.key]}
                        {...input.attr}
                        style={{height: `min(${descrHeight}px, 100px)`}}
                    />
                );
            }
            return <Component ref={refs[input?.attr?.key]} {...input.attr} />;
        });
    };

    return (
        <div className={`z-10 fixed top-0 left-0 w-full h-full flex items-center justify-center`}>
            <div
                onClick={handleClose}
                className={`fixed content-[""] top-0 left-0
                        w-full h-full bg-primary opacity-20`}
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
                    className="w-[100px] bg-primary leading-8 rounded-md text-white mx-auto z-10"
                    onClick={handleSubmit}
                >
                    {props.action == 'edit' ? 'Edit' : 'Create'}
                </button>
            </form>
        </div>
    );
}
