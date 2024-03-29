import vars from '../vars';
import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { FaBell } from 'react-icons/fa';
import {
  checkNotifications,
  getNotifications,
  markNotificationRead,
} from '../tools/snipStore';

import {
  AnimatePresence,
  motion,
  useAnimate,
  usePresence,
} from 'framer-motion';
import { Tooltip } from 'react-tooltip';

type notifyMsgObjT = { type: string; msg: string };
type notifyFuncT = (msg: notifyMsgObjT) => undefined;

export default function Bell(props: { notify: notifyFuncT }) {
  const [state, setState] = useState({ notifications: { show: false } });
  const unreadNotificationsRef = useRef<HTMLDivElement | null>();

  const notifications = useQuery('notificationsBell', () => getNotifications());

  // unmount on Esc
  React.useEffect(() => {
    const eventCB = (e) => {
      if (e.which == 27 && state.notifications.show) {
        toggleNotification(e);
      }
    };
    window.document.body.addEventListener('keydown', eventCB);

    return () => {
      removeEventListener('keydown', eventCB);
    };
  }, [state.notifications.show]);

  useEffect(() => {
    (async () => {
      const response = await checkNotifications();
      if (parseInt(response)) {
        // console.log(response);
        if (
          unreadNotificationsRef.current?.classList.contains('before:hidden')
        ) {
          unreadNotificationsRef.current?.classList.remove('before:hidden');
        }
      }
    })();

    const eventSource = new EventSource(`${vars.serverAddress}/listenEvent`, {
      withCredentials: true,
    });
    const messageHandler = (e: MessageEvent) => {
      // console.log('sse data: ', e.data);
      notifications.refetch();
      unreadNotificationsRef.current?.classList.remove('before:hidden');
      props.notify({ type: 'info', msg: e.data });
    };
    const errorHandler = (err: Event) => {
      // console.error('error: ', err);
    };
    eventSource.addEventListener('message', messageHandler);
    eventSource.addEventListener('error', errorHandler);
    return () => {
      eventSource.removeEventListener('message', messageHandler);
      eventSource.removeEventListener('error', errorHandler);
    };
  }, []);

  const toggleNotification = async (e: MouseEvent) => {
    e.stopPropagation();

    // remove the green bubble from the bell icon when notifications are open and/or closed.
    unreadNotificationsRef.current?.classList.add('before:hidden');

    const stateCpy = structuredClone(state);
    stateCpy.notifications.show = !stateCpy.notifications.show;
    setState(stateCpy);

    // async function(updates notifications state)
    await markNotificationRead();
  };

  const listNotifications = () => {
    if (notifications.status == 'success') {
      return notifications.data.map(
        (notification: { id: string; type: 'string'; message: 'string' }) => {
          return (
            <li key={notification.id} className={`rounded-md py-2`}>
              {notification.type}: {notification.message}
            </li>
          );
        },
      );
    }
  };

  const [bellIconAnimationScope, bellIconAnimate] = useAnimate();
  const handleHoverAnimation = async () => {
    const animationConstants = {
      swingDuration: 0.03,
      swingDistance: 1,
      swingangle: 5,
      iterationsCount: 2,
    };
    const animationObj = {
      left: [
        { rotate: animationConstants.swingangle },
        { x: -animationConstants.swingDistance },
      ],
      right: [
        { rotate: -animationConstants.swingangle },
        { x: animationConstants.swingDistance },
      ],
      reset: { rotate: 0, x: 0 },
    };
    // left swing
    for (let i = 0; i < animationConstants.iterationsCount; i++) {
      for (let x = 0; x < animationObj.left.length; x++) {
        const action = animationObj.left[x];
        await bellIconAnimate(
          bellIconAnimationScope.current,
          animationObj.left[x],
          {
            duration: animationConstants.swingDuration,
          },
        );
      }
      // right swing
      for (let x = 0; x < animationObj.right.length; x++) {
        const action = animationObj.right[x];
        await bellIconAnimate(
          bellIconAnimationScope.current,
          animationObj.right[x],
          {
            duration: animationConstants.swingDuration,
            delay: animationConstants.swingDuration,
          },
        );
      }
    }
    // reset animation
    await bellIconAnimate(bellIconAnimationScope.current, animationObj.reset, {
      duration: animationConstants.swingDuration,
      delay: animationConstants.swingDuration,
    });
  };
  return (
    <>
      <div
        ref={(el) => {
          unreadNotificationsRef.current = el;
          bellIconAnimationScope.current = el;
        }}
        onMouseEnter={handleHoverAnimation}
        className={`hover:cursor-pointer
                        before:hidden before:bg-primary
                        before:w-[7px] before:h-[7px] before:absolute
                      `}
        onClick={toggleNotification}
      >
        <FaBell />
        {/* <Tooltip id='edit' /> */}
      </div>
      <AnimatePresence>
        {state.notifications.show ? (
          <motion.section
            key={'silly yet important property'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggleNotification}
            className={`fixed z-20 top-[50px]
                           bottom-0 flex left-0 justify-end
                           backdrop-blur-sm w-full
                          `}
          >
            <motion.aside
              key={'silly yet important property'}
              initial={{ opacity: 0, x: 500 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 500 }}
              transition={{ duration: 0.3 }}
              className={`scrollbar overflow-auto w-[350px] backdrop-blur-sm
            bg-bg px-3 py-4
            flex-col gap-3`}
            >
              <ul
                className={`list-disc marker:text-primary
                                    marker:text-xl pl-5`}
              >
                {notifications.status ? listNotifications() : <></>}
              </ul>
            </motion.aside>
          </motion.section>
        ) : (
          <></>
        )}
      </AnimatePresence>
    </>
  );
}
