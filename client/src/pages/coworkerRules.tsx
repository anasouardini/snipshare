import React, { useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import ExceptionsPopUp from '../components/exceptionsPopUp';
import AccessControl from '../components/accessControl';
import { readCoworkerRules } from '../tools/snipStore';

import { create, remove, update } from '../tools/bridge';
import { useQuery } from 'react-query';

import {
  FaMinusSquare,
  FaFolderPlus,
  FaRetweet,
  FaPlusSquare,
} from 'react-icons/fa';

import {
  AnimatePresence,
  motion,
  useAnimate,
  usePresence,
} from 'framer-motion';

import { Tooltip } from 'react-tooltip';
import { useSelector } from 'react-redux';
import { type RootState } from '../state/store';
import Skeleton from '../components/skeleton';

export default function AddRules() {
  const navigate = useNavigate();

  const { notify } = useOutletContext();
  // React.useEffect(() => {
  //   notify({ type: 'warning', msg: 'notification test' });
  //   notify({ type: 'error', msg: 'notification test' });
  //   notify({ type: 'info', msg: 'notification test' });
  // }, []);

  const whoami = useSelector((state: RootState) => {
    state.userInfo.data.username;
  });
  // if (whoami == '' || whoami == 'unauthorized') {
  //     console.log('redirecting');
  //     return navigate('/login', {replace: true});
  // }
  // console.log('whoami', whoami);

  const [_, setForceRenderState] = useState(false);

  const [popUpState, setPopUpState] = useState({ showExceptions: false });

  const changedCoworkers = useRef(new Set([]));

  // list of checkboxes
  const genericAccessRefs = useRef({
    new: {},
    old: {},
  });

  const exceptionAccessRefs = useRef({
    new: { coworkerUsername: {} },
    old: {},
  });
  // console.log(exceptionAccessRefs.current);

  //* appended "2" to the id so that I can show-case the loading skeleton
  const userInfo = useQuery('userInfo2', () => {
    return getUser(params.user);
  });
  const coworkersRules = useQuery('coworkers', () => {
    return readCoworkerRules();
  });
  if (coworkersRules.error?.req?.status == 401) {
    navigate('/login', { replace: true });
    return <></>;
  }
  // console.log('query coworkers', coworkersRules.data);

  const eventDefaults = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const deleteCoworker = async (coworkerUsername) => {
    //wait fot the changes before getting the new data
    const response = await remove(`coworkerRules`, {
      props: { coworker: coworkerUsername },
    });

    if (response.status == 200) {
      coworkersRules.refetch();
    }
  };

  const addNewCoworker = async (e) => {
    eventDefaults(e);
    const generic = Object.keys(genericAccessRefs.current.new).reduce(
      (acc, accessKey) => {
        acc[accessKey] = genericAccessRefs.current.new[accessKey].checked;
        return acc;
      },
      {},
    );

    const coworker = exceptionAccessRefs.current.new.coworkerUsername.value;

    const Excpts = exceptionAccessRefs.current.new?.old;
    const exceptions =
      popUpState.oldOrNew == 'new' ? Excpts ?? {} : Excpts?.[coworker] ?? {};

    //-I- check if the coworker exists, better to add coworkers by id and usernames like in discord
    if (coworkersRules.data.generic[coworker]) {
      notify({ type: 'error', msg: 'this coworker already exists' });
      return;
    }

    // console.log('add new', exceptionAccessRefs.current.new?.old);
    const props = {
      coworker,
      generic,
      exceptions,
    };
    //wait fot the changes before getting the new data
    const response = await create(`coworkerRules`, { props });

    notify({ type: 'info', msg: response.msg });

    if (response.status == 200) {
      // clear the new coworker so there will be only one new coworker object
      exceptionAccessRefs.current.new.old = {};
      exceptionAccessRefs.current.new.new = {};

      coworkersRules.refetch();
    }
  };

  const updateCoworker = async (coworkerUsername) => {
    const generic = Object.keys(
      genericAccessRefs.current.old[coworkerUsername],
    ).reduce((acc, accessKey) => {
      acc[accessKey] =
        genericAccessRefs.current.old[coworkerUsername][accessKey].checked;
      return acc;
    }, {});

    const props = {
      coworker: coworkerUsername,
      generic,
      exceptions:
        exceptionAccessRefs.current.old?.old?.[coworkerUsername] ??
        coworkersRules.data.exceptions[coworkerUsername],
    };
    // console.log(props);
    const response = await update(`coworkerRules`, { props });

    if (response.status == 200) {
      changedCoworkers.current.delete(coworkerUsername);
      coworkersRules.refetch();
    }
  };

  const showExceptionsPopUp = (coworker, oldOrNew, coworkerUsername) => {
    // console.log(coworkersRules.data, coworker);
    setPopUpState({
      ...popUpState,
      showExceptions: true,
      coworker,
      oldOrNew,
      coworkerUsername,
    });
  };

  const markChangedCoworker = (coworkerUsername) => {
    changedCoworkers.current.add(coworkerUsername);
    setForceRenderState((old) => !old);
  };

  const hidePopUp = () => {
    // console.log('before hide popup', exceptionAccessRefs.current.new.old);
    setPopUpState({ ...popUpState, showExceptions: false });
  };

  const classes = {
    inputs:
      'border-[1px] border-text4 p-3 rounded-md flex justify-between gap-10 flex-wrap items-center mb-[2rem]',
    buttons: 'flex gap-5',
    // button: 'border-[8px] border-primary px-2 py-1 hover:scale-150',
    iconButton: `text-2xl text-primary inline-block relative
                hover:scale-110 transition-scale duration-200`,
    li: `mb-3 px-3 py-2 border-[1px] border-text4
        rounded-md hover:bg-bg2`,
  };

  const listCoworkers = () => {
    if (coworkersRules.status != 'success') {
      return Array(3)
        .fill(1)
        .map((_, index) => {
          return (
            <Skeleton
              key={index}
              className={`${classes.li} bg-bg2 h-auto flex items-center`}
            >
              <Skeleton
                type='title'
                style={{
                  width: '100px',
                  backgroundColor: 'var(--bg-color-4)',
                }}
              />
              <div className='ml-auto flex'>
                <Skeleton type='button' className='bg-bg4 mx-4' />
                <Skeleton type='button' className='bg-bg4 mx-4' />
                <Skeleton type='button' className='bg-bg4 mx-4' />
              </div>
              <Skeleton
                type='button'
                className='ml-auto'
                style={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: 'var(--bg-color-4)',
                }}
              />
              <Skeleton
                type='button'
                className='ml-4'
                style={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: 'var(--bg-color-4)',
                }}
              />
            </Skeleton>
          );
        });
    }

    if (!Object.keys(coworkersRules.data.generic).length) {
      return (
        <p className='text-center pt-5'>
          You have no coworkers yet, click on "add coworker" to create one.
        </p>
      );
    }

    // console.log({ coworkersRules });
    let coworkersCounter = 0.4;
    return coworkersRules.data.generic ? (
      Object.keys(coworkersRules.data.generic).map((coworkerUsername) => {
        //* a copy of the state keeps the doctor away
        // console.log(coworkersRules.data.generic[coworkerUsername]);
        genericAccessRefs.current.old[coworkerUsername] = {
          ...coworkersRules.data.generic[coworkerUsername],
        };
        coworkersCounter++;
        return (
          <motion.li
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 * coworkersCounter, duration: 0.3 }}
            key={coworkerUsername}
            className={classes.li}
          >
            <div className='flex justify-between items-center flex-wrap gap-10'>
              <div>
                <span>{coworkerUsername}</span>
              </div>
              <AccessControl
                ref={genericAccessRefs.current.old[coworkerUsername]}
                coworkerAccess={coworkersRules.data.generic[coworkerUsername]}
                type='generic'
                markChangedCoworker={(e) => {
                  markChangedCoworker(coworkerUsername);
                }}
              />

              <div className={classes.buttons}>
                <button
                  data-tooltip-id='updateRule'
                  data-tooltip-content='Update Rule'
                  className={`${classes.iconButton} ${
                    changedCoworkers.current.has(coworkerUsername)
                      ? 'text-orange-400'
                      : ''
                  }`}
                  onClick={(e) => {
                    eventDefaults(e);
                    updateCoworker(coworkerUsername);
                  }}
                >
                  <FaRetweet />
                </button>
                <Tooltip
                  style={{ fontSize: '1rem', padding: '2px 15px' }}
                  id='updateRule'
                />
                <button
                  data-tooltip-id='exceptions'
                  data-tooltip-content='Exceptions'
                  className={classes.iconButton}
                  onClick={(e) => {
                    e.preventDefault();
                    showExceptionsPopUp(
                      coworkersRules.data.exceptions[coworkerUsername],
                      'old',
                      coworkerUsername,
                    );
                  }}
                >
                  <FaFolderPlus />
                  {/* <FaPuzzlePiece />
                                    <FaHistory /> */}
                </button>
                <Tooltip
                  id='exceptions'
                  style={{ fontSize: '1rem', padding: '2px 15px' }}
                />
                <button
                  data-tooltip-id='deleteRule'
                  data-tooltip-content='Delete Rule'
                  className={classes.iconButton}
                  onClick={(e) => {
                    eventDefaults(e);
                    deleteCoworker(coworkerUsername);
                  }}
                >
                  <FaMinusSquare />
                </button>
                <Tooltip
                  id='deleteRule'
                  style={{ fontSize: '1rem', padding: '2px 15px' }}
                />
              </div>
            </div>
          </motion.li>
        );
      })
    ) : (
      <></>
    );
  };

  return (
    <div className='container pt-[7rem]'>
      <motion.section
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        aria-label='instructions'
        className='text-text2 mb-11'
      >
        <li>The tags in the middle are for generic access to the account.</li>
        <li>
          The <FaFolderPlus className='inline mx-2 text-primary text-xl' />{' '}
          button is for adding exceptions. exceptions allow you to add rules
          specific to each snippet.
        </li>
        <li>
          The <FaRetweet className='inline mx-2 text-primary text-xl' /> button
          is for updating the rule after a change.
        </li>
        <li>
          The <FaPlusSquare className='inline mx-2 text-primary text-xl' />{' '}
          button is for adding a new coworker.
        </li>
      </motion.section>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={classes.inputs}
      >
        <input
          className='border-[1px] border-primary rounded-md p-1 px-3 w-[150px]'
          type='text'
          placeholder='new Coworker'
          ref={(el) => {
            exceptionAccessRefs.current.new.coworkerUsername = el;
          }}
        />
        <AccessControl ref={genericAccessRefs.current.new} type='generic' />
        <div className={classes.buttons}>
          <button
            data-tooltip-id='addException'
            data-tooltip-content='Add Exception'
            className={classes.iconButton}
            onClick={(e) => {
              e.preventDefault();
              const coworkerUsername =
                exceptionAccessRefs.current.new.coworkerUsername.value ??
                'new user';
              showExceptionsPopUp({}, 'new', coworkerUsername);
            }}
          >
            <FaFolderPlus />
          </button>
          <Tooltip id='addException' />

          <button
            data-tooltip-id='addCoworker'
            data-tooltip-content='Add Coworker'
            className={classes.iconButton}
            onClick={addNewCoworker}
          >
            <FaPlusSquare />
          </button>
          <Tooltip id='addCoworker' />
        </div>
      </motion.div>
      <div className='mt-[2rem]'>
        <ul>{listCoworkers()}</ul>
      </div>
      {popUpState.showExceptions ? (
        <ExceptionsPopUp
          ref={exceptionAccessRefs}
          hidePopUp={hidePopUp}
          coworker={popUpState.coworker}
          oldOrNew={popUpState.oldOrNew}
          coworkerUsername={popUpState.coworkerUsername}
          markChangedCoworker={markChangedCoworker}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
