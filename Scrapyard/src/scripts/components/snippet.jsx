import React, {useState} from 'react';
import {useOutletContext} from 'react-router-dom';

import {commonSnippetFields} from '../tools/snipStore';
import {read, remove} from '../tools/bridge';
import Form from './form/form';
import Preview from './preview';
import {FaLock, FaLockOpen} from 'react-icons/fa';
import CodeSnippet from './form/fields/snippet';
import {useRef} from 'react';

export default function Snippet(props) {
    // const whoami = useContext(GlobalContext);
    const whoami = useOutletContext();

    const [snipInfoState, setSnipInfoState] = useState({
        snippet: props.snippet,
    });
    // console.log(snipInfoState.snippet);

    const [popUpState, setPopUpState] = useState({showForm: false, showPreview: false});

    const formFieldsState = useRef({
        fields: Object.values(structuredClone({commonSnippetFields}))[0],
    });

    const updateFields = () => {
        formFieldsState.current.fields.forEach((field) => {
            if (field.attr.type == 'checkbox') {
                field.attr.defaultChecked = snipInfoState.snippet[field.attr.key];
            } else {
                if (field.attr.type == 'snippet') {
                    field.attr.readOnly = true;
                }
                // console.log(snipInfoState.snippet.id, snipInfoState.snippet[field.attr.key]);
                field.attr.defaultValue = snipInfoState.snippet[field.attr.key];
            }
        });
        console.log(formFieldsState.current.fields);
    };

    // I fixed useEffect()
    const firstRender = useRef(true);
    if (firstRender.current) {
        updateFields();
        firstRender.current = false;
    }
    // ditsh this: useEffect(() => {}, []);

    const handleEdit = (e) => {
        e.stopPropagation();
        if (snipInfoState.snippet.access?.update) {
            formFieldsState.current.fields.forEach((field) => {
                if (field.attr.type == 'snippet') {
                    field.attr.readOnly = false;
                }
            });
            setPopUpState({showForm: true, showPreview: false});
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        // console.log('sdfkljsdfj');

        if (snipInfoState.snippet.access?.delete) {
            // console.log(snipInfoState.snippet);
            const response = await remove(
                snipInfoState.snippet.user + '/' + snipInfoState.snippet.id
            );
            props.update();
            console.log(response.msg);
        }
    };
    // console.log(snipInfoState.snippet);
    const classes = {
        buttons: 'flex justify-around mt-[20px]',
        button: 'w-[100px] leading-8 rounded-md text-white',
        btnPreview: `${
            snipInfoState.snippet.access?.read ? 'bg-cyan-600' : 'bg-gray-400 cursor-not-allowed'
        }`,
        btnEdit: `${
            snipInfoState.snippet.access?.update ? 'bg-primary' : 'bg-gray-400 cursor-not-allowed'
        }`,
        btnDelete: `${
            snipInfoState.snippet.access?.delete ? 'bg-red-500' : 'bg-gray-400 cursor-not-allowed'
        }`,
    };

    const updateEditedSnippet = async () => {
        const response = await read(`${whoami}/${snipInfoState.snippet.id}`);
        if (response?.status == 200) {
            console.log('reading new version');

            // updateFields();
            firstRender.current = true; // to update the fields

            setSnipInfoState({snippet: response.msg});
        }
    };
    const hidePopUp = (popUp) => {
        let newState = {...popUpState};
        if (popUp == 'form') {
            newState.showForm = false;
        } else {
            newState.showPreview = false;
        }

        setPopUpState(newState);
    };

    // console.log(
    //     formFieldsState.current.fields.filter((field) => field.type == 'CodeSnippet')[0].attr
    // );

    // console.log(Object.values(formFieldsState.current.fields)[2].attr);
    return (
        <>
            <div data-key={snipInfoState.snippet.id} draggable="false" className={`bg-[#292929] `}>
                <div className={`snippet flex flex-col max-w-[600px]  p-8`}>
                    {/* Owner and Author and Privacy*/}
                    <div className="flex justify-between mb-4">
                        {/* Owner */}
                        <div className="flex flex-row gap-3">
                            <div className="w-[50px] h-[50px] border-[1px] border-primary rounded-full"></div>
                            <p>
                                <span>{snipInfoState.snippet.user}</span>
                                <br />
                                <span className="text-gray-500 text-sm">
                                    @{snipInfoState.snippet.user}
                                </span>
                            </p>
                        </div>
                        {/* Author */}
                        {snipInfoState.snippet.author != snipInfoState.snippet.user ? (
                            <div className="grow-2">Author: @{snipInfoState.snippet.author}</div>
                        ) : (
                            <></>
                        )}
                        {/* is Private */}
                        <p>
                            {snipInfoState.snippet.isPrivate ? (
                                <FaLock className="text-orange-500" />
                            ) : (
                                <FaLockOpen className="text-primary" />
                            )}
                        </p>
                    </div>
                    {/* Title */}
                    <h3 className="text-xl text-gray-300 mb-3">{snipInfoState.snippet.title}</h3>
                    {/* Description */}
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap mb-3 text-gray-500">
                        {snipInfoState.snippet.descr}
                    </p>
                    {/* Snippet */}
                    <CodeSnippet
                        {...formFieldsState.current.fields.filter(
                            (field) => field.type == 'CodeSnippet'
                        )[0].attr}
                        readOnly={true}
                    />

                    {/* Actions */}
                    <div className={`${classes.buttons}`}>
                        <style>{`
                            button + button {
                                margin-left: 10px;
                            }
                        `}</style>
                        {/* <button
                            onClick={handlePreview}
                            className={`${classes.button} ${classes.btnPreview}`}
                        >
                            Preview
                        </button> */}

                        <button
                            onClick={handleEdit}
                            className={`${classes.button} ${classes.btnEdit}`}
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className={`${classes.button} ${classes.btnDelete} `}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            {popUpState.showForm ? (
                <Form
                    action="edit"
                    fields={formFieldsState.current.fields}
                    hidePopUp={hidePopUp}
                    snipId={snipInfoState.snippet.id}
                    snipUser={snipInfoState.snippet.user}
                    updateEditedSnippet={updateEditedSnippet}
                />
            ) : (
                <></>
            )}
            {popUpState.showPreview ? (
                <Preview
                    hidePopUp={hidePopUp}
                    data={{
                        title: snipInfoState.snippet.title,
                        descr: snipInfoState.snippet.descr,
                        snippet: snipInfoState.snippet.snippet,
                    }}
                />
            ) : (
                <></>
            )}
        </>
    );
}
