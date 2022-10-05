import React from 'react';
import {useNavigate} from 'react-location';
import {create, read} from '../../tools/bridge';

export default function SharedLayout(props) {
    const navigate = useNavigate();
    const changeRoute = (to) => {
        navigate({to, replace: true});
    };

    const classes = {
        li: 'm-2 cursor-pointer border-b-[4px] border-b-transparent hover:border-b-[4px] hover:border-b-lime-600 text-gray-200',
    };

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
                        onClick={async () => {
                            const response = await read('whoami');
                            if (response && response.status == 200) {
                                return changeRoute(response.msg + '/snippets');
                            }
                            console.log(response);
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
            {props.children}
        </div>
    );
}
