import React, {useState, useEffect, createContext} from 'react';
import Snippet from '../components/snippet';
import {useMatch} from 'react-location';
import {useNavigate} from 'react-location';
import Form from '../components/form/form';
import {deepClone} from '../tools/deepClone';
import {getSnippets, getWhoami, updateSnippets} from '../tools/snipStore';

export default function Snippets() {
    const navigate = useNavigate();
    const changeRoute = (to) => {
        navigate({to, replace: true});
    };
    const {
        data: {user: userParam},
    } = useMatch();

    const [popUpState, setPopUpState] = useState({
        showForm: false,
        showPreview: false,
    });
    const [snipInfoState, setSnipInfoState] = useState({
        whoami: '',
        children: [],
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
                type: 'textarea',
                attr: {
                    key: 'snippet',
                    placeholder: 'snippet',
                    name: 'snippet',
                    type: 'textarea',
                    className: fieldsClasses.inputs,
                },
            },
            {
                type: 'IsPrivate',
                attr: {
                    key: 'IsPrivate',
                    name: 'IsPrivate',
                },
            },
            {
                type: 'Coworkers',
                attr: {
                    key: 'Coworkers',
                    name: 'Coworkers',
                },
            },
        ],
    });

    // console.log(snipInfoState);
    const update = async () => {
        const children = await updateSnippets();
        if (children.err == 'unauthorised') {
            return changeRoute('/login');
        }

        if (children.err == 'fetchError') {
            return;
        }

        const stateCpy = deepClone(snipInfoState);
        stateCpy.whoami = getWhoami();
        stateCpy.children = children;
        setSnipInfoState(stateCpy);
    };
    useEffect(() => {
        update();
    }, [userParam]);

    const handleCreate = (e) => {
        e.stopPropagation();
        e.preventDefault();
        //mount form
        setPopUpState({...popUpState, showForm: true});
    };

    const listSnippets = () =>
        snipInfoState.children.map((snippet) => (
            <Snippet
                updateSnippetsCB={update}
                key={snippet.id}
                snippet={snippet}
                user={userParam}
            />
        ));

    return (
        <div>
            <h1 className="text-2xl font-bold my-11 text-center">{userParam}'s Snippets</h1>
            <div className="flex flex-wrap mx-auto items-stretch justify-center gap-7">
                {snipInfoState?.children ? listSnippets() : <></>}

                {/* add a snippet button */}
                {snipInfoState.whoami == userParam ? (
                    <button
                        onClick={handleCreate}
                        className={`border-[1px] border-lime-300 w-[360px]  text-[3rem] text-lime-300`}
                    >
                        +
                    </button>
                ) : (
                    <></>
                )}
                {popUpState.showForm ? (
                    <Form
                        action="create"
                        fields={formFieldsState.fields}
                        updateSnippetsCB={update}
                    />
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
