import React, {useState, useEffect} from 'react';
import {useQuery} from 'react-query';
import {useNavigate, useOutletContext} from 'react-router';
import Form from '../components/form/form';
import Snippet from '../components/snippet';

import {commonSnippetFields, getSnippets, getUsers} from '../tools/snipStore';

export default function Home() {
    const [popUpState, setPopUpState] = useState({
        showForm: false,
        showPreview: false,
    });
    const fieldsClasses = {
        inputs: 'border-b-2 border-b-lime-600 p-1 outline-lime-300 focus:outline-1 bg-[#181818]',
    };
    const [formFieldsState, setFormFieldsState] = useState({
        fields: [...commonSnippetFields],
    });

    const navigate = useNavigate();
    const whoami = useOutletContext();
    // if (whoami == '' || whoami == 'unauthorized') {
    //     console.log('redirecting');
    //     return navigate('/login', {replace: true});
    // }

    const {
        data: users,
        status: getUsersStatus,
        error: getUsersErr,
    } = useQuery(['users'], () => {
        return getUsers();
    });
    if (getUsersErr?.req?.status == 401) {
        return navigate('/login', {replace: true});
    }

    const {
        data: snippets,
        status: snippetsStatus,
        error: snippetsErr,
    } = useQuery(['snippets'], () => {
        return getSnippets();
    });
    if (snippetsErr?.req?.status == 401) {
        return navigate('/login', {replace: true});
    }
    // console.log(snippets);

    const listUsers = () =>
        users.map((user) => (
            <li
                className="ml-4 py-1 px-3 border-b-[2px] border-b-lime-600 cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation(), navigate(`/${user}/snippets`);
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

    // console.log(users, getUsersStatus, getUsersErr);
    return snippets && users ? (
        <div>
            <h2 className="text-center my-[3rem] text-2xl font-bold">
                Check what others are doning
            </h2>
            <ul className="flex justify-center">{listUsers()}</ul>

            <h2 className="text-center mt-[5rem] mb-[3rem] text-2xl font-bold">Other Snippets</h2>
            <div className="flex flex-wrap mx-auto items-stretch justify-center gap-7">
                {listSnippets(snippets)}
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
    ) : (
        <></>
    );
}
