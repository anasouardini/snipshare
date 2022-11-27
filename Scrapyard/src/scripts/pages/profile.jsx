import React from 'react';
import Snippets from '../components/snippets';
import {useOutletContext} from 'react-router';

export default function Profile() {
    const {whoami, avatar, description} = useOutletContext();

  //todo: art, 
    return (
        <div className='mt-[7rem] w-full '>
            {/* todo: profile related info */}
            <section className='mb-10 w-[90%] max-w-[600px] mx-auto'>
                <div className='mb-5'>
                    <div
                        aria-label='avatar'
                        className='w-[90px] h-[90px] border-primary border-2 rounded-[50%] mb-5'
                    >
                        <button>Edit</button>
                        <img src={avatar}></img>
                    </div>
                    <p>
                        {whoami} <button>Edit</button>
                    </p>
                </div>
                <details open>
                    <summary> Profile description</summary>
                    <p>{description}</p>
                    <button>Edit</button>
                </details>
            </section>

            <Snippets />
        </div>
    );
}
