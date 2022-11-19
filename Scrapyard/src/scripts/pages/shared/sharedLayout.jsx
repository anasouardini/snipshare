import React, {useRef} from 'react';
import {
    Outlet,
    useAsyncError,
    useLocation,
    useNavigate,
    useOutlet,
    useOutletContext,
} from 'react-router-dom';
import {useQuery} from 'react-query';
import {create, read} from '../../tools/bridge';
import {Link, NavLink} from 'react-router-dom';
import {useEffect} from 'react';
import {useState} from 'react';
import Notify from '../../components/notify';
import Bell from '../../components/bell';
import {v4 as uuid} from 'uuid';
import {FaBars} from 'react-icons/fa';
import SSE from '../../components/sse.jsx';

export default function SharedLayout(props) {
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

    useEffect(() => {
        updateWhoamiState();
    }, [location.pathname]);

    const classes = {
        navLink: `cursor-pointer pb-2 border-b-[3px] border-b-transparent 
              hover:border-b-primary text-gray-200`,
    };

    if (whoami.msg && whoami?.status == 200 && location.pathname.includes('login')) {
        // console.log('redirecting to home from shared layout');
        navigate('/');
    }

    if (
        (!whoami.msg || whoami?.status == 401) &&
        !location.pathname.includes('login') &&
        !location.pathname.includes('signup')
    ) {
        // console.log('redirecting to login');
        navigate('/login', {replace: true});
    }

    const listNotifications = () => {
        return Object.keys(notifyState).map((notiKey) => (
            <Notify key={notiKey} type={notifyState[notiKey].type} msg={notifyState[notiKey].msg} />
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
              sm>:z-20 sm>:flex sm>:justify-center sm>:items-center bg-dark/75`;
        navRef.current.className = `sm<:px-[5%] sm<:py-2
                                    sm>:flex-row sm>:bg-dark
                                    sm>:border-2 sm>:border-primary sm>:p-4 rounded-md 
                                    `;
        navRef.current.children[0].className = `sm<:flex sm<:gap-3
                                               flex sm>:flex-col sm>:gap-5 px-4`;
    };
    const hideMenu = (e) => {
        const isOverlayVisible = e.currentTarget.classList.contains('navigationOverlay');
        //console.log(e.currentTarget.tagName)
        if (!isOverlayVisible && e.currentTarget.tagName != 'NAV') {
            return;
        }
        menuOverlayRef.current.className = `sm>:block`;
        navRef.current.className = `sm>:hidden sm<:px-[5%] sm<:py-2`;
    };

    return (
        <div className='font-roboto'>
            {/* {whoami.msg} */}
            <div
                onClick={hideMenu}
                ref={menuOverlayRef}
                className={`sm>:flex sm>:justify-center sm>:align-center sm<:px-[5%] sm<:py-2`}
            >
                <button onClick={showMenu} className='sm<:hidden absolute top-3 left-3 text-2xl'>
                    <FaBars />
                </button>

                <nav onClick={hideMenu} ref={navRef} className='sm>:hidden'>
                    <ul className='sm<:flex sm<:gap-3'>
                        <li>
                            <NavLink className={classes.navLink} end to='/'>
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={classes.navLink} to={`${whoami.msg}`}>
                                Me
                            </NavLink>
                        </li>

                        <li className={`ml-auto`}>
                            <NavLink className={classes.navLink} to='/addRules'>
                                Coworkers
                            </NavLink>
                        </li>
                        {whoami.status == 401 ? (
                            <>
                                <li>
                                    <NavLink className={classes.navLink} to='/login' replace>
                                        Login
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className={classes.navLink} to='/signup' replace>
                                        Create Account
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            <></>
                        )}
                        <li
                            className={`cursor-pointer pb-2 border-b-[3px] border-b-transparent 
              hover:border-b-primary text-gray-200`}
                            onClick={async () => {
                                const response = await create('logout');
                                notify({type: 'info', msg: response.msg});
                                return navigate('/login', {replace: true});
                            }}
                        >
                            Logout
                        </li>
                        <li
                            className={`cursor-pointer pb-2 border-b-[3px] border-b-transparent 
              hover:border-b-primary text-gray-200`}
                            onClick={async () => {
                                const response = await create('restart');
                                // setForceRenderState((st) => !st);
                                notify({type: 'info', msg: response.msg});
                            }}
                        >
                            reinitDB
                        </li>
                        {/* <li><Bell/></li> */}
                    </ul>
                </nav>
            </div>
            {/* {props.children} */}
            {whoami &&
            (whoami?.status == 200 ||
                location.pathname.includes('login') ||
                location.pathname.includes('signup')) ? (
                // <GlobalContext.Provider value={whoami}>
                <Outlet context={{whoami: whoami.msg, notify}} />
            ) : (
                // </GlobalContext.Provider>
                <></>
            )}

            {/* notifications */}
            <div className='fixed top-[30px] right-[50%] translate-x-[50%] flex-row'>
                {listNotifications(notifyState)}
            </div>
            {/* <Notify key={'notiKey'} type={'warning'} msg={'empty'} /> */}
            {/* SSE */}
            {whoami && whoami?.status == 200 ? <SSE notify={notify} /> : <></>}
        </div>
    );
}
