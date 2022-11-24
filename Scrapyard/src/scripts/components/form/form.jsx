import React, {useRef, useEffect} from 'react';
import {useOutletContext} from 'react-router-dom';

import {create, update} from '../../tools/bridge';
import fieldsMap from './fieldsMap';

const Form = (props) => {
    const {notify} = useOutletContext();

    const refs = {
        title: useRef(''),
        descr: useRef(''),
        snippet: useRef({parent: null, snippet: null}),
        formButton: useRef(''),
        isPrivate: useRef(''),
        categories: useRef(''),
        language: useRef(''),
        error: useRef(true), // the form is invalid bt default
    };

    // input validation
    const validateForm = () => {
        //helpers
        const removeInvalidStyle = (el, msg) => {
            //removes error styling if exists
            const invalidInputStyle = `border-2 border-red-400 before:block`;
            invalidInputStyle.split(' ').forEach((styleClass) => {
                el.classList.remove(styleClass);
            });
            el.parentNode.querySelector('.error').classList.add('hidden');
            console.log('removing red border');
        };
        const addInvalidStyle = (el, msg) => {
            el.classList.remove('border-2');
            el.classList.remove('border-green-400');

            const invalidInputStyle = `border-2 border-red-400 before:block`;
            invalidInputStyle.split(' ').forEach((styleClass) => {
                el.classList.add(styleClass);
            });
            el.parentNode.querySelector('.error').innerText = msg;
            el.parentNode.querySelector('.error').classList.remove('hidden');
            console.log('adding red border');
        };
        const addValidStyle = (el) => {
            //removes error styling if exists
            el.classList.add('border-2');
            el.classList.add('border-green-400');
            console.log('adding green border');
        };
        //validators
        const validateTitle = () => {
            const element = refs.title.current;
            removeInvalidStyle(element, 'the input is out of range (0-1000)');
            if (element.value.length < 100 && element.value.length > 0) {
                addValidStyle(element);
                return true;
            }
            addInvalidStyle(element, 'the input is out of range (0-100)');
            return false;
        };
        const validateDescription = () => {
            const element = refs.descr.current;
            removeInvalidStyle(element, 'the input is out of range (0-1000)');
            if (element.value.length < 1000 && element.value.length > 0) {
                addValidStyle(element);
                return true;
            }
            return addInvalidStyle(element, 'the input is out of range (0-1000)');
            return false;
        };
        const validateSnippet = () => {
            console.log('snippet validation--------------------- ');
            const elementParent = refs.snippet.current.parent;
            const element = refs.snippet.current.snippet;
            removeInvalidStyle(elementParent, 'the input is out of range (0-1000)');
            if (element.getValue().length < 1000 && element.getValue().length > 0) {
                addValidStyle(elementParent);
                return true;
            }
            addInvalidStyle(elementParent, 'the input is out of range (0-1000)');
            return false;
        };
        // listeners
        refs.title.current.addEventListener('blur', validateTitle);
        refs.descr.current.addEventListener('blur', validateDescription);
        refs.formButton.current.addEventListener('click', () => {
            const validTitle = validateTitle();
            const validDescription = validateDescription();
            const validSnippet = validateSnippet();
            if (validTitle && validDescription && validSnippet) {
                refs.error.current = false; // this ref is checked before submission
            }
        });
    };

    useEffect(validateForm, []);

    const handleClose = (e) => {
        if (e) e.stopPropagation();
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
                    const snippetValue = refs[fieldKey].current.snippet.getValue();
                    body.props[fieldKey] = snippetValue;
                    // console.log(body.props[fieldKey]);
                } else {
                    console.log(refs[fieldKey].current);
                    body.props[fieldKey] = refs[fieldKey].current.value;
                }
            }
        });

        console.log(body);
        return body;
    };

    const handleEdit = async () => {
        const requestBody = createRequestBody();

        const response = await update(props.snipUser + '/' + props.snipId, {
            user: props.snipUser,
            ...requestBody,
        });
        notify({type: 'info', msg: response.msg});

        props.updateEditedSnippet();
    };

    const handleCreate = async () => {
        const requestBody = createRequestBody();
        console.log(requestBody);

        // console.log(props.owner);
        const response = await create(`${props.owner}/snippet`, requestBody);
        notify({type: 'info', msg: response.msg});
        props.refetch();
    };

    const handleSubmit = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (refs.error.current) return;

        handleClose(); // unmount form

        if (props.action == 'edit') {
            return handleEdit();
        }

        await handleCreate();

        handleClose(); //- hacky solution for refetching after form action
    };

    // console.log(Object.values(props.fields)[2].attr);
    // listing form fields
    const listInputs = (fields = []) => {
        // console.log(fields);
        // TODO: clear this spagetty of conditions, DRY it a little
        return fields.map((input) => {
            const Component = fieldsMap(input.type);
            if (input.attr.key == 'descr') {
                let descrHeight = 2 * 35;
                if (input.attr?.defaultValue) {
                    descrHeight = (input.attr.defaultValue.length / 51) * 35;
                }
                // console.log(descrHeight);
                return (
                    <label key={input.attr.key} className={input.attr.className + 'z-30 relative'}>
                        <Component
                            ref={refs[input?.attr?.key]}
                            key={input.attr.key}
                            {...input.attr}
                            style={{height: `min(${descrHeight}px, 100px)`, width: '100%'}}
                        />
                        <div className='error text-red-500 p-1 hidden'></div>
                    </label>
                );
            }

            return (
                <label
                    key={input.attr.key}
                    className={
                        input.attr.className + 'z-30 relative' + input.attr.key == 'isPrivate'
                            ? 'self-start'
                            : ''
                    }
                >
                    <Component
                        ref={refs[input?.attr?.key]}
                        {...input.attr}
                        key={input.attr.key}
                        style={{width: '100%'}}
                    />
                    <div className='error text-red-500 p-1 hidden'></div>
                </label>
            );
        });
    };

    return (
        <div className={`z-10 fixed top-0 left-0 w-full h-full flex items-center justify-center`}>
            <div
                onClick={handleClose}
                className={`fixed content-[""] top-0 left-0
                        w-full h-full bg-primary opacity-20`}
            ></div>
            <form
                ref={refs.form}
                className='flex flex-col w-[600px] gap-6 p-6 pt-8 bg-[#181818] z-30 drop-shadow-2xl relative'
            >
                <span
                    onClick={handleClose}
                    className='absolute content-["X"] top-2 right-2 text-xl cursor-pointer text-gray-700'
                >
                    X
                </span>
                {listInputs(props.fields)}

                <button
                    ref={refs.formButton}
                    className='w-[100px] bg-primary leading-8 rounded-md text-white mx-auto z-10'
                    onClick={handleSubmit}
                >
                    {props.action == 'edit' ? 'Edit' : 'Create'}
                </button>
            </form>
        </div>
    );
};
export default Form;
