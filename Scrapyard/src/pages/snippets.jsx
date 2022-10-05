import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {read} from '../tools/bridge';
import Snippet from '../components/snippet';
import {useMatch} from 'react-location';
import {useNavigate} from 'react-location';
import Form from '../components/form';
import {deepClone} from '../tools/deepClone';

export default function Snippets() {
    const navigate = useNavigate();
    const changeRoute = (to) => {
        navigate({to, replace: true});
    };

    const {
        data: {user},
    } = useMatch();

    const [state, setState] = useState({
        whoami: '',
        showForm: false,
        showPreview: false,
        children: [],
    });

    const closePopUp = () => {
        const newState = deepClone(state);
        newState.showForm = false;
        newState.showPreview = false;
        setState(newState);
    };

    const whoami = async () => {
        const response = await read('whoami');
        if (response && response.status == 200) {
            return response.msg;
        }
    };

    const updateItems = async () => {
        const response = await read(`${user}/snippets`);

        if (response) {
            console.log('fetching');
            console.log(response);
            if (response.status == 200) {
                setState({...state, children: response.msg});
            } else {
                return changeRoute('/login');
            }
            return;
        }

        console.log(response);
    };

    useEffect(() => {
        (async () => {
            updateItems();
            // const children = await updateItems();
            const whoamiUsr = await whoami();
            setState({...state, whoami: whoamiUsr});
        })();
    }, [user]);

    const handleCreate = (e) => {
        e.stopPropagation();
        setState({...state, showForm: true});
    };

    const listSnippets = () =>
        state.children.map((snippet) => (
            <Snippet key={snippet.id} snippet={snippet} updateItems={updateItems} user={user} />
        ));

    return (
        <div>
            <h1 className="text-2xl font-bold my-11 text-center">{user}'s Snippets</h1>
            <div className="flex flex-wrap mx-auto items-stretch justify-center gap-7">
                {state?.children ? listSnippets() : <></>}

                {/* add a snippet button */}
                {state.whoami == user ? (
                    <button
                        onClick={handleCreate}
                        className={`border-[1px] border-lime-300 w-[360px]  text-[3rem] text-lime-300`}
                    >
                        +
                    </button>
                ) : (
                    <></>
                )}

                {state.showForm ? (
                    <Form
                        user={user}
                        updateItems={updateItems}
                        closePopUp={closePopUp}
                        action="create"
                    />
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
