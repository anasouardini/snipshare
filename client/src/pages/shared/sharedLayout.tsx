import vars from '../../vars';
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { create, read } from '../../tools/bridge';
import { useEffect } from 'react';
import { useState } from 'react';
import Notify from '../../components/notify';
import Bell from '../../components/bell';
import { v4 as uuid } from 'uuid';
import { FaBars } from 'react-icons/fa';
import NavMenu from './navMenu';

import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../state/store';
import { actions } from '../../state/userInfo/userInfo';

export default function SharedLayout() {
  const dispatch = useDispatch();

  // const [_, setForceRenderState] = useState(false);
  const updateWhoamiState = async () => {
    // update user info slice
    const whoamiUsr = await read('whoami');
    dispatch(actions.setUserInfo(whoamiUsr.msg));
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

  if (
    whoami?.msg &&
    whoami?.status == 200 &&
    location.pathname.includes('login')
  ) {
    // console.log('redirecting to home from shared layout');
    navigate('/');
  }

  if (
    (!whoami?.msg || whoami?.status == 401) &&
    !location.pathname.includes('login') &&
    !location.pathname.includes('signup')
  ) {
    // console.log('redirecting to login');
    navigate('/login', { replace: true });
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
        return { ...notificationsList };
      });
    }, 3000);

    setNotifyState((notificationsList) => {
      notificationsList[randomKey] = notication;
      return { ...notificationsList }; // changing the memeory refrence for react
    });
    // console.log('timedout', notifyState);
  };

  const menuOverlayRef = React.useRef();
  const navRef = React.useRef();
  const showMenu = (e) => {
    e.stopPropagation();
    //* this is a huge mess but i wanted to experiment with tailwind some more
    menuOverlayRef.current.className = `navigationOverlay sm>:fixed sm>:top-0
      sm>:left-0 sm>:right-0 sm>:bottom-0
      sm>:z-20 sm>:flex sm>:justify-center sm>:items-center sm>:bg-bg/75`;
    navRef.current.className = `sm<:px-[5%] sm<:py-2
      sm>:flex-row sm>:bg-bg
      sm>:border-2 sm>:border-primary sm>:p-4 rounded-md `;
    navRef.current.children[0].className = `sm<:flex sm<:items-center sm<:gap-3
      flex sm>:flex-col sm>:gap-5 px-4`;
  };
  const hideMenu = (e) => {
    const isOverlayVisible =
      e.currentTarget.classList.contains('navigationOverlay');
    //console.log(e.currentTarget.tagName)
    if (!isOverlayVisible && e.currentTarget.tagName != 'NAV') {
      return;
    }
    menuOverlayRef.current.className = `sm>:inherit`;
    navRef.current.className = `sm>:hidden sm<:px-[5%] sm<:py-2
      sm<:fixed sm<:top-0 sm<:right-0
      sm<:left-0 sm<:height-[35px] sm<:z-10 sm<:bg-bg`;
    navRef.current.children[0].className = `sm<:flex 
      sm<:items-center
      sm<:gap-3
      flex sm>:flex-col sm>:gap-5 px-4`;
  };

  return (
    <>
      <header>
        <div onClick={hideMenu} ref={menuOverlayRef} className={`sm>:block`}>
          <button
            onClick={showMenu}
            className='sm<:hidden absolute top-3 left-3 text-2xl'
          >
            <FaBars />
          </button>
          <NavMenu
            hideMenu={hideMenu}
            notify={notify}
            navRef={navRef}
            whoami={whoami}
          />
        </div>
      </header>

      {/* {children} */}
      {whoami &&
      (whoami?.status == 200 ||
        location.pathname.includes('login') ||
        location.pathname.includes('signup')) ? (
        <main className='grow-1 mt-auto pt-20'>
          <Outlet
            context={{
              // whoami: whoami.msg?.username,
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
      <div
        className={`fixed top-[50px] right-[50%] translate-x-[50%] flex-row`}
      >
        {listNotifications(notifyState)}
      </div>

      <footer
        className={`mt-auto w-full flex flex-wrap gap-3 
        justify-center items-center py-4 font-bold`}
      >
        <div className='mt-7'>
          <span className='text-primary'> Made by: </span>
          <a href='https://anasouardini.online'>Anas Ouardini</a>
          <span className='text-primary'> | </span>
          <a href='https://github.com/anasouardini'>Github</a>
          <span className='text-primary'> | </span>
          <a href='https://twitter.com/segfaulty1'>Twitter</a>
          <span className='text-primary'> | </span>
          <a href='https://blog.anasouardini.online'>Blog</a>
        </div>
      </footer>
    </>
  );
}
