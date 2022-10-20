import React from 'react';
import {createContext} from 'react';
import {useNavigate} from 'react-location';
import {useQuery} from 'react-query';
import {create, read} from '../../tools/bridge';

export const GlobalContext = createContext('');

const updateWhoami = async () => {
    const whoamiUsr = await read('whoami');

    return whoamiUsr.msg;
};

export default function SharedLayout(props) {
    const {data: whoami, status} = useQuery(['whoami'], updateWhoami);

    const navigate = useNavigate();
    const changeRoute = (to) => {
        navigate({to, replace: true});
    };

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
                            changeRoute(whoami + '/snippets');
                        }}
                    >
                        my snippets
                    </li>

                    <li
                        className={`${classes.li} ml-auto`}
                        onClick={() => {
                            changeRoute('/addRules');
                        }}
                    >
                        Add Rules
                    </li>
                    <li
                        className={`${classes.li}`}
                        onClick={() => {
                            changeRoute('/signin');
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
                            changeRoute('/signin');
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
                        reinitDB
                    </li>
                </ul>
            </nav>
            {/* {props.children} */}
            {status == 'success' ? (
                <GlobalContext.Provider value={whoami}>{props.children}</GlobalContext.Provider>
            ) : (
                <></>
            )}
        </div>
    );
}
