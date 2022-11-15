import React, {useState, useRef} from 'react';
import {FaBell} from 'react-icons/fa';
import {deepClone} from '../tools/deepClone';

export default function Bell() {
    const [state, setState] = useState({notifacations: {show: false}});
    const bellRef = useRef();
    // todo:
    // aside notifications layout
    // display the number of unread notifications on top of the bell
    // onmount: fetch notifications and mark them as read
    const showNotifications = () => {
        const stateCpy = deepClone(state);
        stateCpy.notifacations.show = true;
        setState(stateCpy);
    };

    return (
        <>
            <div
                ref={bellRef}
                className={`hover:cursor-pointer mt-1 before:bg-primary
                      before:w-[7px] before:h-[7px] before:absolute`}
            >
                <FaBell className='' onClick={showNotifications} />
            </div>
            <aside className='fixed z-30 top-0 right-0 bottom-0 w-[350px]
                            border-primary bg-dark/[.9]'></aside>
        </>
    );
}
