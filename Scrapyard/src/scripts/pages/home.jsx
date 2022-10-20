import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-location';
import Form from '../components/form/form';
import Snippet from '../components/snippet';

import {updateSnippets, updateUsers} from '../tools/snipStore';

export default function Home() {
    const [usersState, setUsersState] = useState({users: []});
    const [snippetsState, setSnippetsState] = useState({snippets: []});
    const [popUpState, setPopUpState] = useState({
        showForm: false,
        showPreview: false,
    });
    const fieldsClasses = {
        inputs: 'border-b-2 border-b-lime-600 p-1 outline-lime-300 focus:outline-1 bg-[#181818]',
    };
    const [formFieldsState, setFormFieldsState] = useState({
        fields: [
            {
                type: 'input',
                attr: {
                    key: 'title',
                    placeholder: 'title',
                    name: 'title',
                    type: 'text',
                    className: fieldsClasses.inputs,
                },
            },
            {
                type: 'textarea',
                attr: {
                    key: 'descr',
                    placeholder: 'description',
                    name: 'descr',
                    type: 'textarea',
                    className: fieldsClasses.inputs,
                },
            },
            {
                type: 'Snippet',
                attr: {
                    key: 'snippet',
                    value: '',
                },
            },
            {
                type: 'IsPrivate',
                attr: {
                    key: 'isPrivate',
                },
            },
            // {
            //     type: 'Coworkers',
            //     attr: {
            //         key: 'coworkers',
            //     },
            // },
        ],
    });

    const navigate = useNavigate();
    const changeRoute = (to) => {
        navigate({to, replace: true});
    };

    useEffect(() => {
        const getData = (() => {
            let users = [];
            let snippets = [];

            const fetchUsers = async () => {
                const response = await updateUsers();
                if (response) {
                    if (response.err == 'unauthorized') {
                        return changeRoute('/login');
                    }

                    users = response;
                }
            };

            const fetchAllSnippets = async () => {
                const response = await updateSnippets();
                if (response) {
                    if (response.err == 'unauthorized') {
                        return changeRoute('/login');
                    }
                    snippets = response;
                }
            };

            const setStates = () => {
                setUsersState({users});
                setSnippetsState({snippets});

                // not sure about this
                users = null;
                snippets = null;
            };

            return {fetchUsers, fetchAllSnippets, setStates};
        })();

        (async () => {
            getData.fetchUsers();
            await getData.fetchAllSnippets();
            getData.setStates();
        })();
    }, []);

    const listUsers = () =>
        usersState.users.map((user) => (
            <li
                className="ml-4 py-1 px-3 border-b-[2px] border-b-lime-600 cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation(), changeRoute(`/${user}/snippets`);
                }}
                key={user}
            >
                {user}
            </li>
        ));

    const update = async () => {};

    const hidePopUp = (popUp) => {
        let newState = {...popUpState};
        if (popUp == 'form') {
            newState.showForm = false;
        } else {
            newState.showPreview = false;
        }

        setPopUpState(newState);
    };

    const listSnippets = (snippets) => {
        // console.log(snippets);
        return snippets.map((snippet) => (
            <Snippet updateSnippetsCB={update} key={snippet.id} snippet={snippet} />
        ));
    };

    const handleCreate = (e) => {
        e.stopPropagation();
        e.preventDefault();
        //mount form
        setPopUpState({...popUpState, showForm: true});
    };

    return (
        <div>
            <h2 className="text-center my-[3rem] text-2xl font-bold">
                Check what others are doning
            </h2>
            <ul className="flex justify-center">{listUsers()}</ul>

            <h2 className="text-center mt-[5rem] mb-[3rem] text-2xl font-bold">Other Snippets</h2>
            <div className="flex flex-wrap mx-auto items-stretch justify-center gap-7">
                {listSnippets(snippetsState.snippets)}
                {/* add a snippet button */}
                {
                    <button
                        onClick={handleCreate}
                        className={`border-[1px] border-lime-300 w-[360px]  text-[3rem] text-lime-300`}
                    >
                        +
                    </button>
                }
                {popUpState.showForm ? (
                    <Form
                        action="create"
                        fields={formFieldsState.fields}
                        updateSnippetsCB={update}
                        hidePopUp={hidePopUp}
                    />
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
