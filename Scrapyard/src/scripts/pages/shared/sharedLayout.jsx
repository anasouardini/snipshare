import React from 'react';
import {Outlet, useLocation, useNavigate, useOutletContext} from 'react-router-dom';
import {useQuery} from 'react-query';
import {create, read} from '../../tools/bridge';
import {Link, NavLink} from 'react-router-dom';
import {useEffect} from 'react';
import {useState} from 'react';

export default function SharedLayout(props) {
    const updateWhoami = async () => {
        const whoamiUsr = await read('whoami');

        return whoamiUsr;
    };

    const updateWhoamiState = async () => {
        const whoamiUsr = await read('whoami');

        setWhoami(whoamiUsr);
    };

    // react-query sucks at this
    // const {data: whoami, status, error} = useQuery(['whoami'], updateWhoami);
    const [whoami, setWhoami] = useState('');

    // console.log('whoami', whoami);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        updateWhoamiState();
    }, [location.pathname]);

    const classes = {
        li: 'm-2 cursor-pointer border-b-[4px] border-b-transparent hover:border-b-[4px] hover:border-b-lime-600 text-gray-200',
    };

    if (whoami && whoami?.status == 200 && location.pathname.includes('login')) {
        console.log('redirecting to home from shared layout');
        navigate('/');
    }

    if (whoami && whoami?.status == 401 && !location.pathname.includes('login')) {
        console.log('redirecting to login');
        navigate('/login', {replace: true});
    }

    if (whoami && (whoami?.status == 200 || location.pathname.includes('login'))) {
        return (
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
                {whoami ? (
                    // <GlobalContext.Provider value={whoami}>
                    <Outlet context={whoami.msg} />
                ) : (
                    // </GlobalContext.Provider>
                    <></>
                )}
            </div>
        );
    } else {
        return <p>you are not logged in</p>;
    }
}
