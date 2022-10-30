import React from 'react';
import {Outlet, useLocation, useNavigate, useOutletContext} from 'react-router-dom';
import {useQuery} from 'react-query';
import {create, read} from '../../tools/bridge';
import {Link, NavLink} from 'react-router-dom';
import {useEffect} from 'react';
import {useState} from 'react';

export default function SharedLayout(props) {
    // const [_, setForceRenderState] = useState(false);
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
        navLink:
            'cursor-pointer border-b-[3px] border-b-transparent hover:border-b-primary text-gray-200',
    };

    if (whoami.msg && whoami?.status == 200 && location.pathname.includes('login')) {
        // console.log('redirecting to home from shared layout');
        navigate('/');
    }

    if ((!whoami.msg || whoami?.status == 401) && !location.pathname.includes('login')) {
        // console.log('redirecting to login');
        navigate('/login', {replace: true});
    }

    // console.log(typeof whoami);

    return (
        <div className="font-roboto">
            {/* {whoami.msg} */}
            <nav>
                <ul className="flex gap-3">
                    <li>
                        <NavLink className={classes.navLink} end to="/">
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={classes.navLink} to={`${whoami.msg}/snippets`}>
                            Me
                        </NavLink>
                    </li>

                    <li className={`ml-auto`}>
                        <NavLink className={classes.navLink} to="/addRules">
                            Add Rules
                        </NavLink>
                    </li>
                    {whoami.status == 401 ? (
                        <>
                            <li>
                                <NavLink className={classes.navLink} to="/login" replace>
                                    Login
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className={classes.navLink} to="/signup" replace>
                                    Create Account
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <></>
                    )}
                    <li
                        className="cursor-pointer border-b-[3px] border-b-transparent hover:border-b-primary text-gray-200"
                        onClick={async () => {
                            const response = await create('logout');
                            console.log(response);
                            return navigate('/login', {replace: true});
                        }}
                    >
                        Logout
                    </li>
                    <li
                        className="cursor-pointer border-b-[3px] border-b-transparent hover:border-b-primary text-gray-200"
                        onClick={async () => {
                            const response = await create('restart');
                            // setForceRenderState((st) => !st);
                            console.log(response);
                        }}
                    >
                        reinitDB
                    </li>
                </ul>
            </nav>
            {/* {props.children} */}
            {whoami && (whoami?.status == 200 || location.pathname.includes('login')) ? (
                // <GlobalContext.Provider value={whoami}>
                <Outlet context={whoami.msg} />
            ) : (
                // </GlobalContext.Provider>
                <></>
            )}
        </div>
    );
}
