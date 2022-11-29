import React from 'react';
import Snippets from '../components/snippets';
import {useOutletContext} from 'react-router';
import {FaPen} from 'react-icons/fa';

export default function Profile() {
    const {whoami, avatar, description} = useOutletContext();

    //todo: art,
    return (
        <div className='mt-[7rem] w-full '>
            {/* todo: profile related info */}
            <section className='mb-10 w-[90%] max-w-[600px] mx-auto'>
                <div className={`mb-5`}>
                    <style>{`.profile-img:has(button):hover > button.hidden{display: block}`}</style>
                    <div
                        aria-label='avatar'
                        className={`profile-img relative flex justify-center items-center w-[90px]
                            h-[90px] border-primary border-2 rounded-[50%] mb-5 overflow-hidden`}
                    >
                        <img
                            alt='profile image'
                            src={avatar}
                            crossOrigin='anonymous'
                            style={{width: '90px', height: '90px'}}
                            className='absolute top-0 left-0 bottom-0 right-0'
                        ></img>
                        <button className='hidden text-primary z-10 bg-dark/50 shadow-2xl text-md'>
                            <FaPen />
                        </button>
                    </div>
                    <p>
                        {whoami}
                        <button className='inline ml-6 text-primary'>
                            <FaPen />
                        </button>
                    </p>
                </div>
                <div className='relative'>
                    <details open>
                        <summary className='cursor-pointer w-max'>
                            {' '}
                            Profile description
                        </summary>
                        <p className='mt-2'>
                            {description} lkjfs lkfjslkd jfslkj lskdfjls kjflksj lksjfl
                            skjflksdj flskjflsk jflksj dlkfsldk jflskd jlskfj lskd
                        </p>
                    </details>
                    <button className='absolute top-0 left-[167px] inline ml-6 text-primary'>
                        <FaPen />
                    </button>
                </div>
            </section>

            <Snippets />
        </div>
    );
}
