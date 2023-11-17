import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, useAnimate, usePresence } from 'framer-motion';
import { create, read } from '../../tools/bridge';
import Bell from '../../components/bell';

interface NavMenuProps {
  hideMenu: () => {};
  notify: ()=>{};
  navRef: {};
  whoami: {status: number}
}
const NavMenu = ({ hideMenu, navRef, whoami, notify }) => {
  const classes = {
    navLink: `cursor-pointer pb-2 border-b-[3px] border-b-transparent 
              hover:border-b-primary text-gray-200`,
  };

  const [hacksSubMenuScope, hacksSubMenuAnimate] = useAnimate();
  const [isPresent, safeToRemove] = usePresence();

  const loginAs = async ({ usr, passwd, keepSignIn }) => {
    await create('logout');

    const response = await create('signin', {
      usr,
      passwd,
      keepSignIn,
    });

    if (response && response.status == 200) {
      // console.log('redirect to home');
      // react-router redirection was not cutting it in this case
      return document.location.reload();
      // return navigate('/');
    }

    // console.log('not success :)');
    // console.log(response);
    // console.log(create);
  };


  return (
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
        {/* TODO: extract hacks menu to its separate component */}
        {/* and use 'exit' (framer-motion elm property) to animate on UNMOUNT */}
        <ul
          ref={hacksSubMenuScope}
          onMouseOver={e => {
            // document
            //   .querySelector('#hacksSubMenu')
            //   .classList.remove('hidden');

            hacksSubMenuAnimate('#hacksSubMenu', {
              y: 10,
              opacity: 1,
              display: 'block',
            });
          }}
          onMouseOut={async e => {
            await hacksSubMenuAnimate('#hacksSubMenu', {
              y: -10,
              opacity: 0,
            });
            console.log('end hiding...');

            document.querySelector('#hacksSubMenu').classList.add('hidden');
          }}
          className={`relative cursor-pointer text-gray-200
                  border-2 rounded-md border-orange-500 px-2 py-1`}
        >
          Hacks
          <motion.ul
            initial={{ y: -10, opacity: 0, display: 'none' }}
            id='hacksSubMenu'
            className={`z-30 absolute top-[20px] right-0 pt-4`}
          >
            <ul
              onMouseOver={e => {
                e.currentTarget
                  .querySelector(':scope > ul')
                  .classList.remove('hidden');
              }}
              onMouseOut={e => {
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
                      usr: 'admin',
                      passwd: 'admin',
                      keepSignIn: false,
                    });
                  }}
                >
                  admin
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
                          hover:bg-[#2a2a2a] text-gray-200
                          p-2 px-3`}
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
                console.log(response);
                // setForceRenderState((st) => !st);
                notify({ type: 'info', msg: response.msg });
              }}
            >
              reinitDB
            </li>
          </motion.ul>
        </ul>
        {whoami.status == 401 ? (
          <>
            <li className='sm<:ml-auto'>
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
          <>
            <li
              className='ml-auto sm>:ml-0'
              onClick={async () => {
                const response = await create('logout');
                notify({ type: 'info', msg: response.msg });

                document.location.replace(`/login`);
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
  );
};

export default NavMenu;
