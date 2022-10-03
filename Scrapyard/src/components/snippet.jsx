import React, {useState} from 'react';
import Form from './form';

export default function Snippet(props) {
    // console.log('hell');

    const [state, setState] = useState({showForm: false});

    const handleDelete = (e) => {
        e.stopPropagation();
        if (props.snippet.allowedActions.includes('delete')) {
            //handle deletion
        }
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        if (props.snippet.allowedActions.includes('edit')) {
            setState({showForm: true});
        }
    };

    const closeForm = () => {
        setState({showForm: false});
    };

    const lorem =
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley";

    const classes = {
        buttons: 'flex justify-between mt-[20px]',
        button: 'w-[100px] leading-8 rounded-md text-white',
        private:
            'pointer-events-none select-none relative after:absolute after:content-["PRIVATE"] after:top-[40%] after:left-[34%] after:font-extrabold after:text-red-600 after:text-2xl after:border-y-[5px] after:border-red-600',
    };

    return (
        <>
            <div
                data-key={props.snippet.id}
                draggable="false"
                className={`shadow-lg shadow-lime-100`}
            >
                <div className={`snippet flex flex-col min-w-[300px] max-w-[380px] p-8`}>
                    <h3 className="text-xl text-gray-700 mb-3">{props.snippet.title}</h3>
                    {/* <p className="text-[1.1rem] text-gray-500">
                        {props.snippet?.descr ? props.snippet.descr : lorem}
                    </p> */}
                    {/* <hr className="border-none h-[1px] bg-gray-400 my-5 mx-auto w-[100px]" /> */}
                    <div className=" text-gray-700">
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
                            onClick={handleEdit}
                            className={`${classes.button} ${
                                props.snippet.allowedActions.includes('edit')
                                    ? 'bg-lime-600'
                                    : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className={`${classes.button} ${
                                props.snippet.allowedActions.includes('delete')
                                    ? 'bg-red-500'
                                    : 'bg-gray-400 cursor-not-allowed'
                            } `}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            {state.showForm ? (
                <Form
                    user={props.user}
                    snippetID={props.snippet.id}
                    inputs={{
                        title: props.snippet.title,
                        descr: props.snippet.descr,
                        snippet: props.snippet.snippet,
                    }}
                    updateItems={props.updateItems}
                    closeForm={closeForm}
                />
            ) : (
                <></>
            )}
        </>
    );
}
