import React, {useState, useEffect, useRef} from 'react';
import {useQuery} from 'react-query';
import {FaBell} from 'react-icons/fa';
import {deepClone} from '../tools/deepClone';
import {
    checkNotifications,
    getNotifications,
    markNotificationRead,
} from '../tools/snipStore';

export default function Bell(props) {
    const [state, setState] = useState({notifications: {show: false}});
    const unreadNotificationsRef = useRef();

    const notifications = useQuery('notificationsBell', () => getNotifications());

    useEffect(() => {
        (async () => {
            const response = await checkNotifications();
            if (parseInt(response)) {
                // console.log(response);
                if (
                    Array.from(unreadNotificationsRef.current.classList).includes(
                        'before:hidden'
                    )
                ) {
                    unreadNotificationsRef.current.classList.remove('before:hidden');
                }
            }
        })();

        const eventSource = new EventSource('http://127.0.0.1:2000/listenEvent', {
            withCredentials: true,
        });
        const messageHandler = (e) => {
            console.log('sse data: ', e.data);
            // todo:
            notifications.refetch();
            unreadNotificationsRef.current.classList.remove('before:hidden');
            props.notify({type: 'info', msg: e.data});
        };
        const errorHandler = (err) => {
            console.error('error: ', err);
        };
        const messageListener = eventSource.addEventListener('message', messageHandler);
        const errorListener = eventSource.addEventListener('error', errorHandler);
        return () => {
            eventSource.removeEventListener(messageListener, messageHandler);
            eventSource.removeEventListener(errorListener, errorHandler);
        };
    }, []);

    const toggleNotification = async (e) => {
        // todo: fix the bug

        unreadNotificationsRef.current.classList.add('before:hidden');

        const stateCpy = deepClone(state);
        stateCpy.notifications.show = !stateCpy.notifications.show;
        setState(stateCpy);

        // async function(updates notifications state)
        await markNotificationRead();
    };

    const listNotifications = () => {
        if (notifications.status == 'success') {
            return notifications.data.map((notification) => {
                return (
                    <li key={notification.id} className={`rounded-md py-2`}>
                        {notification.type}: {notification.message}
                    </li>
                );
            });
        }
    };

    return (
        <>
            <div
                ref={unreadNotificationsRef}
                className={`hover:cursor-pointer mt-1
                        before:hidden before:bg-primary
                        before:w-[7px] before:h-[7px] before:absolute
                      `}
                onClick={toggleNotification}
            >
                <FaBell className='' />
            </div>
            {state.notifications.show ? (
                <section
                    onClick={toggleNotification}
                    className={`fixed z-20 top-[40px]
                           bottom-0 flex left-0 justify-end
                           backdrop-blur-sm w-full
                          `}
                >
                    <aside
                        className={`scrollbar overflow-auto w-[350px] backdrop-blur-sm
                             bg-[#242424]/[.5] px-3 py-4
                              flex-col gap-3`}
                    >
                        <ul
                            className={`list-disc marker:text-primary
                                    marker:text-xl pl-5`}
                        >
                            {notifications.status ? listNotifications() : <></>}
                        </ul>
                    </aside>
                </section>
            ) : (
                <></>
            )}
        </>
    );
}
