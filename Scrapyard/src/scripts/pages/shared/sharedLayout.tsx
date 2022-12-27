import React, {useRef} from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {create, read} from '../../tools/bridge';
import {NavLink} from 'react-router-dom';
import {useEffect} from 'react';
import {useState} from 'react';
import Notify from '../../components/notify';
import Bell from '../../components/bell';
import {v4 as uuid} from 'uuid';
import {FaBars} from 'react-icons/fa';

export default function SharedLayout() {
    // const [_, setForceRenderState] = useState(false);
    const updateWhoamiState = async () => {
        const whoamiUsr = await read('whoami');
        setWhoami(whoamiUsr);
    };

    // react-query sucks at this
    // const {data: whoami, status, error} = useQuery(['whoami'], updateWhoami);
    const [whoami, setWhoami] = useState('');
    const [notifyState, setNotifyState] = useState({});

    // console.log('whoami', whoami);
    const navigate = useNavigate();
    const location = useLocation();

    // outlet uses this to update the whoami info
    const reload = () => {
        updateWhoamiState();
    };
    useEffect(() => {
        updateWhoamiState();
    }, [location.pathname]);

    const classes = {
        navLink: `cursor-pointer pb-2 border-b-[3px] border-b-transparent 
              hover:border-b-primary text-gray-200`,
    };

    if (whoami?.msg && whoami?.status == 200 && location.pathname.includes('login')) {
        console.log('redirecting to home from shared layout');
        navigate('/');
    }

    if (
        (!whoami?.msg || whoami?.status == 401) &&
        !location.pathname.includes('login') &&
        !location.pathname.includes('signup')
    ) {
        // console.log('redirecting to login');
        navigate('/login', {replace: true});
    }

    const listNotifications = () => {
        return Object.keys(notifyState).map((notiKey) => (
            <Notify
                key={notiKey}
                type={notifyState[notiKey].type}
                msg={notifyState[notiKey].msg}
            />
        ));
    };

    // passed as react-router-context to the outlet
    // and as a prop to the SSE component
    const notify = (notication) => {
        const randomKey = uuid();

        setTimeout(() => {
            setNotifyState((notificationsList) => {
                delete notificationsList[randomKey];
                return {...notificationsList};
            });
        }, 3000);

        setNotifyState((notificationsList) => {
            notificationsList[randomKey] = notication;
            return {...notificationsList}; // changing the memeory refrence for react
        });
        // console.log('timedout', notifyState);
    };

    const menuOverlayRef = useRef();
    const navRef = useRef();
    const showMenu = (e) => {
        e.stopPropagation();
        // THIS IS A HUGE MESS BUT IT'S A CHANCE TO EXPERIMENT WITH TAILWIND SOME MORE
        menuOverlayRef.current.className = `
              navigationOverlay sm>:fixed sm>:top-0 sm>:left-0 sm>:right-0 sm>:bottom-0
              sm>:z-20 sm>:flex sm>:justify-center sm>:items-center sm>:bg-dark/75`;
        navRef.current.className = `sm<:px-[5%] sm<:py-2
                                    sm>:flex-row sm>:bg-dark
                                    sm>:border-2 sm>:border-primary sm>:p-4 rounded-md 
                                    `;
        navRef.current.children[0].className = `sm<:flex sm<:items-center sm<:gap-3
                                               flex sm>:flex-col sm>:gap-5 px-4`;
    };
    const hideMenu = (e) => {
        const isOverlayVisible = e.currentTarget.classList.contains('navigationOverlay');
        //console.log(e.currentTarget.tagName)
        if (!isOverlayVisible && e.currentTarget.tagName != 'NAV') {
            return;
        }
        menuOverlayRef.current.className = `sm>:inherit`;
        navRef.current.className = `sm>:hidden sm<:px-[5%] sm<:py-2
                                    sm<:fixed sm<:top-0 sm<:right-0
                                    sm<:left-0 sm<:height-[35px] sm<:z-10 sm<:bg-dark`;
        navRef.current.children[0].className = `sm<:flex sm<:items-center sm<:gap-3
                                               flex sm>:flex-col sm>:gap-5 px-4`;
    };

    const loginAs = async ({usr, passwd, keepSignIn}) => {
        await create('logout');

        const response = await create('signin', {
            usr,
            passwd,
            keepSignIn,
        });

        if (response && response.status == 200) {
            // console.log('redirect to home');
            // react-router redirection was not cutting it in this case
            return document.location.replace('http://127.0.0.1:3000/');
            // return navigate('/');
        }

        console.log('not success :)');
        console.log(response);
        // console.log(create);
    };

    return (
        <header>
            <div onClick={hideMenu} ref={menuOverlayRef} className={`sm>:block`}>
                <button
                    onClick={showMenu}
                    className='sm<:hidden absolute top-3 left-3 text-2xl'
                >
                    <FaBars />
                </button>

                <nav
                    onClick={hideMenu}
                    ref={navRef}
                    className={`sm>:hidden
                                    sm<:px-[5%] sm<:py-2
                                    fixed sm<:top-0 sm<:right-0
                                    sm<:left-0 sm<:height-[35px] sm<:z-10 sm<:bg-dark`}
                >
                    <ul className='sm<:flex sm<:items-center sm<:gap-3'>
                        <li>
                            <NavLink className={classes.navLink} end to='/'>
                                Home
                            </NavLink>
                        </li>

                        <li>
                            <NavLink className={classes.navLink} to='/addRules'>
                                Coworkers
                            </NavLink>
                        </li>
                        {/*
                          HACKS MENU 
                          TODO: DRY
                        */}

                        <ul
                            onMouseOver={(e) => {
                                e.currentTarget
                                    .querySelector(':scope > ul')
                                    .classList.remove('hidden');
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget
                                    .querySelector(':scope > ul')
                                    .classList.add('hidden');
                            }}
                            className={`relative cursor-pointer text-gray-200 border-2 rounded-md border-orange-500 px-2 py-1`}
                        >
                            Hacks
                            <ul
                                className={`hidden z-30 absolute top-[20px] right-0 pt-4`}
                            >
                                <ul
                                    onMouseOver={(e) => {
                                        e.currentTarget
                                            .querySelector(':scope > ul')
                                            .classList.remove('hidden');
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget
                                            .querySelector(':scope > ul')
                                            .classList.add('hidden');
                                    }}
                                    className={`cursor-pointer pb-2 bg-[#222222] hover:bg-[#282828]
                                              border-[1px] border-[#353525] border-b-0 text-gray-200 p-2 px-3`}
                                >
                                    login as
                                    <ul
                                        className={`hidden absolute top-0 right-[100%]
                                                  bg-gray-200 border-[1px] border-[#353525]`}
                                    >
                                        <li
                                            className={`cursor-pointer pb-2 bg-[#222222]
                                                        hover:bg-[#2a2a2a] text-gray-200 p-2 px-3`}
                                            onClick={() => {
                                                loginAs({
                                                    usr: 'venego',
                                                    passwd: 'venego',
                                                    keepSignIn: false,
                                                });
                                            }}
                                        >
                                            venego
                                        </li>
                                        <li
                                            className={`cursor-pointer pb-2 bg-[#222222]
                                                      hover:bg-[#2a2a2a] text-gray-200 p-2 px-3`}
                                            onClick={() => {
                                                loginAs({
                                                    usr: '3sila',
                                                    passwd: '3sila',
                                                    keepSignIn: false,
                                                });
                                            }}
                                        >
                                            3sila
                                        </li>
                                        <li
                                            className={`cursor-pointer pb-2 bg-[#222222]
                                                        hover:bg-[#2a2a2a] text-gray-200 p-2 px-3`}
                                            onClick={() => {
                                                loginAs({
                                                    usr: 'm9ila',
                                                    passwd: 'm9ila',
                                                    keepSignIn: false,
                                                });
                                            }}
                                        >
                                            m9ila
                                        </li>
                                        <li
                                            className={`cursor-pointer pb-2 bg-[#222222]
                                                        hover:bg-[#2a2a2a] text-gray-200 p-2 px-3`}
                                            onClick={() => {
                                                loginAs({
                                                    usr: '3disa',
                                                    passwd: '3disa',
                                                    keepSignIn: false,
                                                });
                                            }}
                                        >
                                            3disa
                                        </li>
                                    </ul>
                                </ul>
                                <li
                                    className={`cursor-pointer pb-2 bg-[#222222] hover:bg-[#282828]
                                                border-[1px] border-[#353525] border-t-0
                                                text-gray-200 p-2 px-3`}
                                    onClick={async () => {
                                        const response = await create('restart');
                                        // setForceRenderState((st) => !st);
                                        notify({type: 'info', msg: response.msg});
                                    }}
                                >
                                    reinitDB
                                </li>
                            </ul>
                        </ul>
                        {whoami.status == 401 ? (
                            <>
                                <li className='sm<:ml-auto'>
                                    <NavLink
                                        className={classes.navLink}
                                        to='/login'
                                        replace
                                    >
                                        Login
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        className={classes.navLink}
                                        to='/signup'
                                        replace
                                    >
                                        Create Account
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            <>
                                <li
                                    className='ml-auto sm>:ml-0'
                                    onClick={async () => {
                                        const response = await create('logout');
                                        notify({type: 'info', msg: response.msg});

                                        document.location.replace(
                                            'http://127.0.0.1:3000/login'
                                        );
                                        // return navigate('/login', {replace: true});
                                    }}
                                >
                                    <p
                                        className='cursor-pointer
                                                  text-gray-200pb-1 border-b-[3px]
                                                  border-b-transparent 
                                                  hover:border-b-primary'
                                    >
                                        Logout
                                    </p>
                                </li>
                                {whoami && whoami?.status == 200 ? (
                                    <>
                                        <li>
                                            <Bell notify={notify} />
                                        </li>
                                        <li>
                                            <NavLink
                                                className={classes.navLink}
                                                to={`user/${whoami?.msg?.username}`}
                                            >
                                                <figure
                                                    className='border-primary border-[1px]
                                                    w-[40px] h-[40px] rounded-[50%]
                                                       overflow-hidden'
                                                >
                                                    <img
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                        }}
                                                        crossOrigin='anonymous | use-credentials'
                                                        src={whoami?.msg?.avatar}
                                                    ></img>
                                                </figure>
                                            </NavLink>
                                        </li>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </>
                        )}
                    </ul>
                </nav>
            </div>
            {/* {props.children} */}
            {whoami &&
            (whoami?.status == 200 ||
                location.pathname.includes('login') ||
                location.pathname.includes('signup')) ? (
                <main>
                    <Outlet
                        context={{
                            whoami: whoami.msg?.username,
                            notify,
                            avatar: whoami.msg?.avatar,
                            description: whoami.msg?.description,
                            reload,
                        }}
                    />
                </main>
            ) : (
                <></>
            )}

            {/* notifications */}
            <div className='fixed top-[50px] right-[50%] translate-x-[50%] flex-row'>
                {listNotifications(notifyState)}
            </div>
        </header>
    );
}
