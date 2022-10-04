import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {read} from '../tools/bridge';
import Snippet from '../components/snippet';
import {useMatch} from 'react-location';
import {useNavigate} from 'react-location';

export default function Snippets() {
    const navigate = useNavigate();

    const changeRoute = (to) => {
        navigate({to, replace: true});
    };

    const {
        data: {user},
    } = useMatch();

    const [state, setState] = useState({});

    const updateItems = async () => {
        const response = await read(`${user}/snippets`);

        if (response) {
            console.log('fetching');
            console.log(response);
            if (response.status == 200) {
                setState({children: response.msg});
            } else {
                changeRoute('/login');
            }
            return;
        }

        console.log(response);
    };

    const createSnippet = async () => {
        const response = await create(`${user}/snippet`, {
            props: {title: '', descr: '', snippet: ''},
        });

        if (response) {
            console.log(response);
            if (response.status == 200) {
                updateItems();
            }
        }
    };

    const listSnippets = () =>
        state.children.map((snippet) => (
            <Snippet key={snippet.id} snippet={snippet} updateItems={updateItems} user={user} />
        ));

    useEffect(() => {
        updateItems();
    }, [user]);

    return (
        <div>
            <h1 className="text-2xl font-bold my-11 text-center">{user}'s Snippets</h1>
            <div className="flex flex-wrap mx-auto items-stretch justify-center gap-7">
                {state?.children ? listSnippets() : <></>}
            </div>
        </div>
    );
}
