import React from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import {useQuery} from 'react-query';
import {create, read} from '../../tools/bridge';
import {Link, NavLink} from 'react-router-dom';

const updateWhoami = async () => {
    const whoamiUsr = await read('whoami');

    return whoamiUsr;
};

export default function SharedLayout(props) {
    const {data: whoami, status} = useQuery(['whoami'], updateWhoami);
    console.log(whoami);
    const navigate = useNavigate();

    const classes = {
        li: 'm-2 cursor-pointer border-b-[4px] border-b-transparent hover:border-b-[4px] hover:border-b-lime-600 text-gray-200',
    };
    return whoami?.msg ? (
        <div className="font-roboto">
            {/* {whoami.msg} */}
            <nav>
                <ul className="flex">
                    <li className={classes.li}>
                        <NavLink end to="/">
                            Home
                        </NavLink>
                    </li>
                    <li className={classes.li}>
                        <NavLink to={`${whoami.msg}/snippets`}>My Snippets</NavLink>
                    </li>

                    <li className={`${classes.li} ml-auto`}>
                        <NavLink to="/addRules">Add Rules</NavLink>
                    </li>
                    {whoami.status == 401 ? (
                        <>
                            <li className={`${classes.li}`}>
                                <NavLink to="/login" replace>
                                    Login
                                </NavLink>
                            </li>
                            <li className={classes.li}>
                                <NavLink to="/signup" replace>
                                    Create Account
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <></>
                    )}
                    <li
                        className={classes.li}
                        onClick={async () => {
                            const response = await create('logout');
                            console.log(response);
                            return navigate('/login', {replace: true});
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
                // <GlobalContext.Provider value={whoami}>
                <Outlet context={whoami.msg} />
            ) : (
                // </GlobalContext.Provider>
                <></>
            )}
        </div>
    ) : (
        <></>
    );
}
