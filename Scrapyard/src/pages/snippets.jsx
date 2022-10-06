import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {read} from '../tools/bridge';
import Snippet from '../components/snippet';
import {useMatch} from 'react-location';
import {useNavigate} from 'react-location';
import Form from '../components/form/form';
import {deepClone} from '../tools/deepClone';
import {updateItems, whoami} from '../tools/asyncOps';
import {Bridge} from '../tools/stateBridge';

export default function Snippets() {
    const navigate = useNavigate();
    const changeRoute = (to) => {
        navigate({to, replace: true});
    };
    const {
        data: {user},
    } = useMatch();

    const [popUpState, setpopUpState] = useState({
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

    useEffect(() => {
        const bridges = {
            popUpState: {
                state: popUpState,
                render: (newState = undefined) => {
                    let newStateCpy = newState ?? state;
                    // console.log(newStateCpy);
                    setpopUpState(newStateCpy);
                },
            },
            snipInfoState: {
                state: snipInfoState,
                render: (newState = undefined) => {
                    let newStateCpy = newState ?? state;
                    // console.log(newStateCpy);
                    setSnipInfoState(newStateCpy);
                },
            },
            formFieldsState: {
                state: formFieldsState,
                render: (newState = undefined) => {
                    let newStateCpy = newState ?? state;
                    // console.log(newStateCpy);
                    setFormFieldsState(newStateCpy);
                },
            },
        };
        Bridge.initBridge('snippets', bridges);

        (async () => {
            const children = await updateItems(snipInfoState.user);
            if (children.err == 'unauthorised') {
                return changeRoute('/login');
            }

            if (children.err == 'fetchError') {
                return;
            }

            const whoamiUsr = await whoami();
            if (whoamiUsr.err == 'fetchError') {
                return;
            }
            setSnipInfoState({whoami: whoamiUsr, children});
        })();
    }, [user]);

    const handleCreate = (e) => {
        e.stopPropagation();
        //mount form
        setpopUpState({showForm: true, showPreview: popUpState.showPreview});
    };

    const listSnippets = () =>
        snipInfoState.children.map((snippet) => (
            <Snippet key={snippet.id} snippet={snippet} updateItems={updateItems} user={user} />
        ));

    return (
        <div>
            <h1 className="text-2xl font-bold my-11 text-center">{user}'s Snippets</h1>
            <div className="flex flex-wrap mx-auto items-stretch justify-center gap-7">
                {snipInfoState?.children ? listSnippets() : <></>}

                {/* add a snippet button */}
                {snipInfoState.whoami == user ? (
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
                    <Form id="snippets" action="create" fields={formFieldsState.fields} />
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
