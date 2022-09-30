import React from 'react';
import {useNavigate} from 'react-location';

export default function SharedLayout(props) {
    const navigate = useNavigate();
    const changeRoute = (to) => {
        navigate({to, replace: true});
    };

    const classes = {
        li: 'm-2 cursor-pointer border-b-[4px] border-b-transparent hover:border-b-[4px] hover:border-b-lime-600',
    };

    return (
        <div className="font-roboto">
            <nav>
                <ul className="flex">
                    <li
                        className={classes.li}
                        onClick={() => {
                            changeRoute('/login');
                        }}
                    >
                        login
                    </li>
                    <li
                        className={classes.li}
                        onClick={() => {
                            changeRoute('/signup');
                        }}
                    >
                        signup
                    </li>
                    <li
                        className={classes.li}
                        onClick={() => {
                            changeRoute('venego/snippets');
                        }}
                    >
                        venego snippets
                    </li>
                    <li
                        className={classes.li}
                        onClick={() => {
                            changeRoute('3sila/snippets');
                        }}
                    >
                        3sila snippets
                    </li>
                    <li
                        className={classes.li}
                        onClick={() => {
                            changeRoute('m9ila/snippets');
                        }}
                    >
                        m9ila snippets
                    </li>
                </ul>
            </nav>
            {props.children}
        </div>
    );
}
