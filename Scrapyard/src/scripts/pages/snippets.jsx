import React, {useState, useEffect, createContext} from 'react';
import Snippet from '../components/snippet';
import {useMatch} from 'react-location';
import {useNavigate} from 'react-location';
import Form from '../components/form/form';
import {deepClone} from '../tools/deepClone';
import {updateSnippets} from '../tools/snipStore';
import {useContext} from 'react';
import {GlobalContext} from './shared/sharedLayout';

export default function Snippets() {
    const navigate = useNavigate();
    const changeRoute = (to) => {
        navigate({to, replace: true});
    };

    const whoami = useContext(GlobalContext);

    if (whoami == '' || whoami == 'none') {
        return changeRoute('/signin');
    }
    const {
        data: {user: userParam},
    } = useMatch();

    const [popUpState, setPopUpState] = useState({
        showForm: false,
        showPreview: false,
    });
    const [snipInfoState, setSnipInfoState] = useState({
        children: [],
    });

    const [formFieldsState, setFormFieldsState] = useState({
        fields: [
            {
                type: 'input',
                attr: {
                    key: 'title',
                    placeholder: 'title',
                    name: 'title',
                    type: 'text',
                },
            },
            {
                type: 'textarea',
                attr: {
                    key: 'descr',
                    placeholder: 'description',
                    name: 'descr',
                    type: 'textarea',
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

    const update = async () => {
        const children = await updateSnippets(userParam);
        // console.log(children);
        if (children.err) {
            if (children.err == 'unauthorized') {
                return changeRoute('/signin');
            }

            return;
        }

        const stateCpy = deepClone(snipInfoState);
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

    const listSnippets = (snippets) => {
        // console.log(snipInfoState);
        return snippets.map((snippet) => {
            // console.log(snippet);
            return (
                <Snippet
                    updateSnippetsCB={update}
                    whoami={whoami}
                    key={snippet.id}
                    snippet={snippet}
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

        setPopUpState(newState);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold my-11 text-center">{userParam}'s Snippets</h1>
            <div className="flex flex-wrap mx-auto items-stretch justify-center gap-7">
                {listSnippets(snipInfoState.children)}

                {/* add a snippet button */}
                {whoami == userParam ? (
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
                        hidePopUp={hidePopUp}
                    />
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
