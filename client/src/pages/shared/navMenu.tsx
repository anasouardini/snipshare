import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useAnimate,
  usePresence,
} from 'framer-motion';
import { create, read } from '../../tools/bridge';
import Bell from '../../components/bell';
import { Camera, Moon, MoonIcon, Sun, SunDim, X, MenuIcon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../state/store';
import { actions } from '../../state/userPreferences/userPreferences';

interface NavMenuProps {
  hideMenu: () => {};
  notify: () => {};
  navRef: {};
  whoami: { status: number };
}
const NavMenu = ({ hideMenu, navRef, whoami, notify }: NavMenuProps) => {
  const userPreferences = useSelector(
    (state: RootState) => state.userPreferences,
  );
  const dispatch = useDispatch();
  const changeTheme = () => dispatch(actions.toggleTheme());

  const classes = {
    navLink: `transition-border duration-300 ease-in-out cursor-pointer pb-2 border-b-[3px] border-b-transparent 
    hover:border-b-primary text-text`,
  };

  const [menuState, setMenuState] = React.useState({
    hacks: {
      show: false,
    },
    loginas: {
      show: false,
    },
  });

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
      onClick={(e) => e.stopPropagation()}
      ref={navRef}
      className={`sm>:hidden
              sm<:px-[5%] sm<:py-2
              fixed sm<:top-0 sm<:right-0
              sm<:left-0 sm<:height-[35px] sm<:z-10 sm<:bg-bg`}
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
        <ul
          ref={hacksSubMenuScope}
          onMouseOver={(e) => {
            setMenuState((state) => {
              const stateClone = structuredClone(state);
              stateClone.hacks.show = true;
              return stateClone;
            });
          }}
          onMouseOut={(e) => {
            setMenuState((state) => {
              const stateClone = structuredClone(state);
              stateClone.hacks.show = false;
              return stateClone;
            });
          }}
          className={`relative cursor-pointer text-text
                  border-2 rounded-md border-orange-500 px-2 py-1`}
        >
          Hacks
          <AnimatePresence>
            {menuState.hacks.show ? (
              <motion.ul
                key={'silly yet important property'}
                initial={{ y: -10, opacity: 0 }}
                animate={{
                  y: 10,
                  opacity: 1,
                }}
                exit={{
                  y: -10,
                  opacity: 0,
                }}
                id='hacksSubMenu'
                className={`z-30 absolute top-[8px] right-0 mt-4
                            border-[1px] border-[#353525]`}
              >
                <ul
                  onMouseOver={(e) => {
                    setMenuState((state) => {
                      const stateClone = structuredClone(state);
                      stateClone.loginas.show = true;
                      return stateClone;
                    });
                  }}
                  onMouseOut={(e) => {
                    setMenuState((state) => {
                      const stateClone = structuredClone(state);
                      stateClone.loginas.show = false;
                      return stateClone;
                    });
                  }}
                  className={`cursor-pointer pb-2 bg-bg hover:bg-bg3
                      border-[1px] border-bg2 border-b-0 text-text p-2 px-3`}
                >
                  login as
                  <AnimatePresence>
                    {menuState.loginas.show ? (
                      <motion.ul
                        key={'silly yet important property'}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{
                          y: 10,
                          opacity: 1,
                        }}
                        exit={{
                          y: -10,
                          opacity: 0,
                        }}
                        className={`absolute top-[-11px] right-[100%]
                        bg-gray-200 border-[1px] border-[#353525]`}
                      >
                        <li
                          className={`cursor-pointer pb-2 bg-bg
                         hover:bg-bg3 text-text p-2 px-3`}
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
                          className={`cursor-pointer pb-2 bg-bg
                          hover:bg-bg3 text-text p-2 px-3`}
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
                          className={`cursor-pointer pb-2 bg-bg
                          hover:bg-bg3 text-text
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
                          className={`cursor-pointer pb-2 bg-bg
                                  hover:bg-bg3 text-text p-2 px-3`}
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
                      </motion.ul>
                    ) : (
                      <></>
                    )}
                  </AnimatePresence>
                </ul>
                <li
                  className={`cursor-pointer pb-2 bg-bg hover:bg-bg3
                      border-[1px] border-bg2 border-t-0
                      text-text p-2 px-3`}
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
            ) : (
              <></>
            )}
          </AnimatePresence>
        </ul>
        <li className='ml-auto'>
          <button className={`themeButton`} onClick={changeTheme}>
            {userPreferences.theme === 'dark' ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}
          </button>
        </li>
        {whoami.status == 401 ? (
          <>
            <li className='/*sm<:ml-auto*/'>
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
              className='sm>:ml-0'
              onClick={async () => {
                const response = await create('logout');
                notify({ type: 'info', msg: response.msg });

                document.location.replace(`/login`);
                // return navigate('/login', {replace: true});
              }}
            >
              <button
                className='cursor-pointer py-[.5rem]
                        text-gray-200pb-1 border-b-[3px]
                        border-b-transparent 
                        hover:border-b-primary
                        transition-border duration-300 ease-in-out
                        '
              >
                Logout
              </button>
            </li>
            {whoami && whoami?.status == 200 ? (
              <>
                <li>
                  <Bell notify={notify} />
                </li>
                <li>
                  <NavLink
                    className={`${classes.navLink}`}
                    to={`user/${whoami?.msg?.username}`}
                  >
                    <figure
                      className='border-primary border-2
                               w-[40px] h-[40px]
                               hover:scale-[1.09]
                               transition-scale
                               duration-[0.3s]
                               ease-in-out
                               rounded-[50%]
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
