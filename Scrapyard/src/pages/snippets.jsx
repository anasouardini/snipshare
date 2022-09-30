import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {read} from '../tools/bridge';
import Snippet from './snippet';
import {useMatch} from 'react-location';

export default function Snippets() {
    const {
        data: {user},
    } = useMatch();

    const listSnippets = () =>
        state.children.map((snippet) => <Snippet key={snippet.title} snippet={snippet} />);

    const [state, setState] = useState({});

    useEffect(() => {
        (async () => {
            const response = await read(`${user}/snippets`);

            if (response) {
                // console.log('success');
                console.log(response);
                if (response.status == 200) {
                    setState({children: response.msg});
                }
                return;
            }

            console.log(response);
        })();
    }, [user]);

    return (
        <div>
            <h1 className="text-2xl font-bold my-11 text-center text-gray-800">
                {user}'s Snippets
            </h1>
            <div className="flex flex-wrap mx-auto items-stretch justify-center gap-7">
                {state?.children ? listSnippets() : <></>}
            </div>
        </div>
    );
}
