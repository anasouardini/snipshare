import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-location';
import {read} from '../tools/bridge';

export default function Home() {
    const [state, setState] = useState({users: []});

    const navigate = useNavigate();
    const changeRoute = (to) => {
        navigate({to, replace: true});
    };

    const loadUsers = async () => {
        const response = await read(`users`);
        if (response?.redirect) {
            return changeRoute('/login');
        }
        if (response) {
            // console.log('fetching');
            console.log(response);
            if (response.status == 200) {
                setState({users: response.msg});
            }
            return;
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <div>
            <h2 className="text-center my-[3rem] text-2xl font-bold">List of other developers</h2>
            <ul className="flex justify-center">
                {state.users.map((user) => (
                    <li
                        className="ml-4 py-1 px-3 border-b-[2px] border-b-lime-600 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation(), changeRoute(`/${user}/snippets`);
                        }}
                        key={user}
                    >
                        {user}
                    </li>
                ))}
            </ul>

            <h2 className="text-center mt-[5rem] mb-[3rem] text-2xl font-bold">
                Suggested snippets
            </h2>
        </div>
    );
}
