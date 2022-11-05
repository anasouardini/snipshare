import React, {useState, useEffect} from 'react';
import {useQuery} from 'react-query';
import {useNavigate, useOutletContext, useParams} from 'react-router';
import Form from '../components/form/form';
import Snippets from '../components/snippets';

import {commonSnippetFields, getSnippets, getUsers} from '../tools/snipStore';

export default function Home() {
    const [popUpState, setPopUpState] = useState({
        showForm: false,
        showPreview: false,
    });

    const [formFieldsState, _] = useState({
        fields: [...commonSnippetFields],
    });

    // const navigate = useNavigate();
    // const {user: userParam} = useParams();

    const whoami = useOutletContext();
    // if (whoami == '' || whoami == 'unauthorized') {
    //     console.log('redirecting');
    //     return navigate('/login', {replace: true});
    // }

    // const {
    //     data: users,
    //     status: getUsersStatus,
    //     error: getUsersErr,
    // } = useQuery(['users'], () => {
    //     return getUsers();
    // });
    // if (getUsersErr?.req?.status == 401) {
    //     return navigate('/login', {replace: true});
    // }
    // console.log(users);

    const hidePopUp = (popUp) => {
        let newState = {...popUpState};
        if (popUp == 'form') {
            newState.showForm = false;
        } else {
            newState.showPreview = false;
        }

        //- this renders twice
        setPopUpState(newState);
    };

    const handleCreate = (e) => {
        e.stopPropagation();
        e.preventDefault();

        setPopUpState({...popUpState, showForm: true});
    };

    // console.log(users, getUsersStatus, getUsersErr);
    return true ? (
        <div className="mt-12">
            {/*
                <h2 className="text-center my-[3rem] text-2xl font-bold">
                Check what others are doing
                </h2>
                <ul className="flex justify-center">{listUsers()}</ul>
                <h2 className="text-center mt-[5rem] mb-[3rem] text-2xl font-bold">Other Snippets</h2>
            */}

            <div className="flex flex-col mx-auto items-center justify-center gap-7">
                <Snippets />
                {/* add a snippet button */}

                {popUpState.showForm ? (
                    <Form
                        action="create"
                        fields={formFieldsState.fields}
                        hidePopUp={hidePopUp}
                        owner={whoami}
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
