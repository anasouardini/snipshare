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
        <div>
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
                            changeRoute('/snippets');
                        }}
                    >
                        snippets
                    </li>
                </ul>
            </nav>
            {props.children}
        </div>
    );
}
