import React from 'react';
import {Outlet} from 'react-router-dom';
// import {useNavigate} from 'react-router';
import {useQuery} from 'react-query';
import {create, read} from '../../tools/bridge';
import {Link, NavLink} from 'react-router-dom';

// export const GlobalContext = createContext('');

const updateWhoami = async () => {
    const whoamiUsr = await read('whoami');

    return whoamiUsr.msg;
};

export default function SharedLayout(props) {
    const {data: whoami, status} = useQuery(['whoami'], updateWhoami);

    // const navigate = useNavigate();
    // const changeRoute = (to) => {
    //     navigate({to, replace: true});
    // };

    const classes = {
        li: 'm-2 cursor-pointer border-b-[4px] border-b-transparent hover:border-b-[4px] hover:border-b-lime-600 text-gray-200',
    };
    console.log(whoami);
    return (
        <div className="font-roboto">
            <nav>
                <ul className="flex">
                    <li className={classes.li}>
                        <NavLink end to="/">
                            Home
                        </NavLink>
                    </li>
                    <li className={classes.li}>
                        <NavLink to={`${whoami}/snippets`}>My Snippets</NavLink>
                    </li>

                    <li className={`${classes.li} ml-auto`}>
                        <NavLink to="/addRules">Add Rules</NavLink>
                    </li>
                    {whoami == 'unauthorized' ? (
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
                <Outlet context={whoami} />
            ) : (
                // </GlobalContext.Provider>
                <></>
            )}
        </div>
    );
}
