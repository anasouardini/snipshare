import React, {useState, useEffect} from 'react';
import Snippet from '../components/snippet';
// import {useNavigate, useMatch} from 'react-location';
import {useParams, useOutletContext} from 'react-router-dom';
import Form from '../components/form/form';

import {commonSnippetFields, getSnippets} from '../tools/snipStore';
import {useNavigate} from 'react-router-dom';
import {useQuery} from 'react-query';

export default function Snippets() {

    const navigate = useNavigate();


    const whoami = useOutletContext();
    // if (whoami == '' || whoami == 'unauthorized') {
    //     console.log(whoami);
    //     return navigate('/login', {replace: true});
    // }

    const {user: userParam} = useParams();

    const [popUpState, setPopUpState] = useState({
        showForm: false,
        showPreview: false,
    });
    const {
        refetch: snippetsRefetch,
        data: snippets,
        status,
        error,
    } = useQuery(['snippets'], () => {
        return getSnippets(userParam);
    });

    useEffect(() => {
        // console.log('refetching');
        snippetsRefetch();
    }, [userParam]);

    // console.log(snippets);
    if (error?.req?.status == 401) {
        return navigate('/login', {replace: true});
    }

    const [formFieldsState] = useState({
        fields: Object.values(structuredClone({commonSnippetFields}))[0],
    });

    // snippetsRefetch();

    // console.log(commonSnippetFields);

    const handleCreate = (e) => {
        e.stopPropagation();
        e.preventDefault();
        //mount form

        setPopUpState({...popUpState, showForm: true});
    };

    const listSnippets = (snippets) => {
        // console.log(status);
        return snippets.map((snippet) => {
            return (
                <Snippet
                    whoami={whoami}
                    key={snippet.id}
                    snippet={snippet}
                    update={() => {
                        // console.log('hhh');
                        snippetsRefetch();
                    }}
                />
            );
        });
    };

    const hidePopUp = (popUp) => {
        let newState = {...popUpState};
        if (popUp == 'form') {
            newState.showForm = false;
        } else {
            newState.showPreview = false;
        }

        snippetsRefetch();

        setPopUpState(newState);
    };

    // console.log(snippets);

    return status == 'success' ? (
        <div>
            <div className="flex flex-col mx-auto items-center justify-center gap-7">

                {/* add a snippet button */}
                {whoami == userParam || snippets.genericAccess?.create ? (
                    <button
                        onClick={handleCreate}
                        className={`border-[1px] border-lime-300 w-[360px]  text-[3rem] text-lime-300`}
                    >
                        +
                    </button>
                ) : (
                    <></>
                )}

                {listSnippets(snippets.snippets)}
                {popUpState.showForm ? (
                    <Form
                        action="create"
                        fields={formFieldsState.fields}
                        hidePopUp={hidePopUp}
                        owner={userParam}
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
