import React, {useState} from 'react';
import {remove} from '../tools/bridge';
import Form from './form/form';
import Preview from './preview';

export default function Snippet(props) {
    // console.log('hell');

    const [state, setState] = useState({showForm: false, showPreview: false});

    const fieldsClasses = {
        inputs: 'border-b-2 border-b-lime-600 p-1 outline-lime-300 focus:outline-1 bg-[#181818]',
    };
    const [formFieldsState, setFormFieldsState] = useState({
        fields: [
            {
                type: 'input',
                attr: {
                    key: 'title',
                    name: 'title',
                    type: 'text',
                    className: fieldsClasses.inputs,
                },
            },
            {
                type: 'textarea',
                attr: {
                    key: 'descr',
                    name: 'descr',
                    type: 'textarea',
                    className: fieldsClasses.inputs,
                },
            },
            {
                type: 'textarea',
                attr: {
                    key: 'snippet',
                    name: 'snippet',
                    type: 'textarea',
                    className: fieldsClasses.inputs,
                },
            },
        ],
    });

    const handlePreview = (e) => {
        e.stopPropagation();
        if (props.snippet.allowedActions.includes('read')) {
            setState({showPreview: true});
        }
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        if (props.snippet.allowedActions.includes('edit')) {
            setState({showForm: true});
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();

        if (props.snippet.allowedActions.includes('delete')) {
            // console.log(props.snippet);
            const response = await remove(props.user + '/' + props.snippet.id);
            console.log(response.msg);

            if (response.status == 200) {
                props.updateItems(props.user);
            }
        }
    };

    const closePopUp = () => {
        setState({showForm: false, showPreview: false});
    };

    const classes = {
        buttons: 'flex justify-between mt-[20px]',
        button: 'w-[100px] leading-8 rounded-md text-white',
        btnPreview: `${
            props.snippet.allowedActions.includes('read')
                ? 'bg-cyan-600'
                : 'bg-gray-400 cursor-not-allowed'
        }`,
        btnEdit: `${
            props.snippet.allowedActions.includes('edit')
                ? 'bg-lime-600'
                : 'bg-gray-400 cursor-not-allowed'
        }`,
        btnDelete: `${
            props.snippet.allowedActions.includes('delete')
                ? 'bg-red-500'
                : 'bg-gray-400 cursor-not-allowed'
        }`,
        private: `pointer-events-none select-none relative 
            after:absolute after:content-["PRIVATE"] after:top-[40%]
            after:left-[34%] after:font-extrabold after:text-red-600
            after:text-2xl after:border-y-[5px] after:border-red-600`,
    };

    return (
        <>
            <div
                data-key={props.snippet.id}
                draggable="false"
                className={`border-[1px] border-lime-300`}
            >
                <div className={`snippet flex flex-col w-[360px] p-8`}>
                    <h3 className="text-xl text-gray-300 mb-3">{props.snippet.title}</h3>
                    <div>
                        <p>
                            status:&nbsp;
                            <span className="text-gray-500">
                                {props.snippet.isPrivate ? 'private' : 'public'}
                            </span>
                        </p>
                        <p>
                            allowed actions:&nbsp;
                            <span className="text-gray-500">
                                {props.snippet.allowedActions.reduce(
                                    (acc, action) => acc + ' | ' + action
                                )}
                            </span>
                        </p>
                    </div>
                    <div className={classes.buttons}>
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
            {state.showForm ? (
                <Form
                    action="edit"
                    user={props.user}
                    snippetID={props.snippet.id}
                    fields={formFieldsState.fields}
                    updateItems={props.updateItems}
                    closePopUp={closePopUp}
                />
            ) : (
                <></>
            )}
            {state.showPreview ? (
                <Preview
                    fields={[{type: 'div', attr: {className: 'text-2xl text-red-500'}}]}
                    data={{
                        title: props.snippet.title,
                        descr: props.snippet.descr,
                        snippet: props.snippet.snippet,
                    }}
                    closePopUp={closePopUp}
                />
            ) : (
                <></>
            )}
        </>
    );
}
