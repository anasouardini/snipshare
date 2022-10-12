import React from 'react';
import {createContext} from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {useNavigate} from 'react-location';
import {create, read} from '../../tools/bridge';

export const GlobalContext = createContext('');

export default function SharedLayout(props) {
    const [whoamiState, setWhoamiState] = useState('');

    const navigate = useNavigate();
    const changeRoute = (to) => {
        navigate({to, replace: true});
    };

    useEffect(() => {
        (async () => {
            const whoamiUsr = await read('whoami');
            if (whoamiUsr.redirect) {
                return navigate('./login');
            }
            if (whoamiUsr.status != 200) {
                return;
            }
            setWhoamiState(whoamiUsr.msg);
        })();
    }, []);

    const classes = {
        li: 'm-2 cursor-pointer border-b-[4px] border-b-transparent hover:border-b-[4px] hover:border-b-lime-600 text-gray-200',
    };
    // console.log(props.children.props);
    return (
        <div className="font-roboto">
            <nav>
                <ul className="flex">
                    <li
                        className={classes.li}
                        onClick={() => {
                            changeRoute('/');
                        }}
                    >
                        Home
                    </li>
                    <li
                        className={classes.li}
                        onClick={() => {
                            changeRoute(whoamiState + '/snippets');
                        }}
                    >
                        my snippets
                    </li>
                    <li
                        className={`${classes.li} ml-auto`}
                        onClick={() => {
                            changeRoute('/login');
                        }}
                    >
                        SignIn
                    </li>
                    <li
                        className={classes.li}
                        onClick={() => {
                            changeRoute('/signup');
                        }}
                    >
                        SignUp
                    </li>
                    <li
                        className={classes.li}
                        onClick={async () => {
                            changeRoute('/login');
                            const response = await create('logout');
                            console.log(response);
                        }}
                    >
                        Logout
                    </li>
                    <li
                        className={classes.li}
                        onClick={async () => {
                            const response = await create('restart');
                            console.log(response);
                        }}
                    >
                        restart
                    </li>
                </ul>
            </nav>
            {/* {props.children} */}
            <GlobalContext.Provider value={whoamiState}>{props.children}</GlobalContext.Provider>
        </div>
    );
}
