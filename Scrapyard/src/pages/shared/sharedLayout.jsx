import React from 'react';
import {useNavigate} from 'react-location';

export default function SharedLayout(props) {
    const navigate = useNavigate();
    const changeRoute = (to) => {
        navigate({to, replace: true});
    };

    return (
        <div>
            <nav>
                <ul className="flex">
                    <li
                        onClick={() => {
                            changeRoute('./login');
                        }}
                    >
                        login
                    </li>
                    <li
                        onClick={() => {
                            changeRoute('./signup');
                        }}
                    >
                        signup
                    </li>
                    <li
                        onClick={() => {
                            changeRoute('./shop');
                        }}
                    >
                        shop
                    </li>
                </ul>
            </nav>
            {props.children}
        </div>
    );
}
