import React, {useState} from 'react';
import {useOutletContext} from 'react-router-dom';

import {commonSnippetFields} from '../tools/snipStore';
import {read, remove} from '../tools/bridge';
import Form from './form/form';
import Preview from './preview';

export default function Snippet(props) {
    // const whoami = useContext(GlobalContext);
    const whoami = useOutletContext();

    const [snipInfoState, setSnipInfoState] = useState({
        snippet: props.snippet,
    });
    // console.log(snipInfoState.snippet);

    const [popUpState, setPopUpState] = useState({showForm: false, showPreview: false});

    const [formFieldsState, setFormFieldsState] = useState({
        fields: [...commonSnippetFields],
    });

    const handlePreview = (e) => {
        e.stopPropagation();
        if (snipInfoState.snippet.access?.read) {
            setPopUpState({showPreview: true, showForm: false});
        }
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        if (snipInfoState.snippet.access?.update) {
            formFieldsState.fields.forEach((field) => {
                if (field.attr.type == 'checkbox') {
                    field.attr.defaultChecked = snipInfoState.snippet[field.attr.key];
                } else {
                    field.attr.defaultValue = snipInfoState.snippet[field.attr.key];
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
        buttons: 'flex justify-between mt-[20px]',
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
            console.log('raeding new version');
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

    return (
        <>
            <div
                data-key={snipInfoState.snippet.id}
                draggable="false"
                className={`border-[1px] border-lime-300`}
            >
                <div className={`snippet flex flex-col w-[360px] p-8`}>
                    <h3 className="text-xl text-gray-300 mb-3">{snipInfoState.snippet.title}</h3>
                    <div>
                        <p>
                            status:&nbsp;
                            <span className="text-gray-500">
                                {snipInfoState.snippet.isPrivate ? 'private' : 'public'}
                            </span>
                        </p>
                        <p>
                            allowed actions:&nbsp;
                            <span className="text-gray-500">
                                {Object.keys(snipInfoState.snippet.access).reduce((acc, access) => {
                                    acc += snipInfoState.snippet.access[access]
                                        ? access + ' | '
                                        : '';
                                    return acc;
                                }, '')}
                            </span>
                        </p>
                    </div>
                    <div className={`${classes.buttons}`}>
                        <style>{`
                            button + button {
                                margin-left: 10px;
                            }
                        `}</style>
                        <button
                            onClick={handlePreview}
                            className={`${classes.button} ${classes.btnPreview}`}
                        >
                            Preview
                        </button>

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
                    fields={formFieldsState.fields}
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
