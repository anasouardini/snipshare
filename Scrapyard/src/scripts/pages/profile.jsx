import React, {useState} from 'react';
import Snippets from '../components/snippets';
import {update, updateFile} from '../tools/bridge';
import {useOutletContext} from 'react-router-dom';
import {FaPen} from 'react-icons/fa';

export default function Profile() {
    const {whoami, avatar, description, reload} = useOutletContext();

    const profileInfo = {username: whoami, description, avatar};

    const refs = React.useRef({
        inputs: {username: null, description: null},
        view: {username: null, description: null},
        buttons: {username: null, description: null},
        buttonHoverStyle: null,
    }).current;

    const editMode = (e, inputName) => {
        refs['buttons'][inputName].classList.add('hidden');
        refs['view'][inputName].classList.add('hidden');

        refs['inputs'][inputName].classList.remove('hidden');
        refs['inputs'][inputName].focus();
    };

    //todo: this does not cover the upload event
    const viewMode = async (e, inputName) => {
        if ((e.type == 'keypress' && e.key == 'Enter') || e.type == 'blur') {
            refs['buttons'][inputName].classList.remove('hidden');
            refs['view'][inputName].classList.remove('hidden');

            const input = refs['inputs'][inputName];
            input.classList.add('hidden');

            // nothing to Change
            if (input.value == profileInfo[inputName]) {
                return;
            }

            //todo: update the db
            const res = await update(`users`, {
                [inputName]: input.value,
            });
            if (res.status == 200) {
                refs['view'][inputName].innerText = input.value;
            }

            // to prevent any errors related to validating the user.
            // I probably should put the user's id in the JWT tokent in stead of the username
            if (inputName == 'username') {
                document.location.replace('http://127.0.0.1:3000/login');
            }
            console.log(res);
        }
    };

    const fileChange = async (e) => {
        //todo: upload the file to the API
        // e.target.parentNode.submit();

        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('avatar', file, `${whoami}.${file.name.split('.').reverse()[0]}`);
        const res = await updateFile(`users`, formData);

        // console.log(res);
        if (res && res.status == 200) {
            reload();
        }
    };

    //todo: art,
    return (
        <div className='mt-[7rem] w-full '>
            {/* todo: profile related info */}
            <section className='mb-10 w-[90%] max-w-[600px] mx-auto'>
                {/* avatar */}
                <div className={`mb-5`}>
                    <style
                        ref={(el) => {
                            refs.buttonHoverStyle = el;
                        }}
                    >{`.profile-img:has(label):hover > label.hidden{display: block}`}</style>
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

                        <label
                            htmlFor='uploadBtn'
                            className={`hidden cursor-pointer z-10 bg-dark/60 shadow-2xl
                                      text-primary text-[.9rem] py-[3px] px-2
                                        border-primary border-2`}
                        >
                            Change
                        </label>
                        <form encType='multipart/form-data' className='hidden'>
                            <input
                                name='avatar'
                                type='file'
                                id='uploadBtn'
                                onChange={(e) => {
                                    fileChange(e);
                                }}
                                accept='.jpg, .jpeg, .png'
                            />
                        </form>
                    </div>
                </div>

                {/* username */}
                <p className='mb-5 text-xl'>
                    <input
                        onKeyPress={(e) => {
                            viewMode(e, 'username');
                        }}
                        onBlur={(e) => {
                            viewMode(e, 'username');
                        }}
                        ref={(el) => {
                            refs.inputs.username = el;
                        }}
                        className='hidden'
                        defaultValue={whoami}
                    />
                    <span
                        ref={(el) => {
                            refs.view.username = el;
                        }}
                    >
                        {whoami}
                    </span>
                    <button
                        ref={(el) => {
                            refs.buttons.username = el;
                        }}
                        onClick={(e) => {
                            editMode(e, 'username');
                        }}
                        className='inline ml-6 text-primary'
                    >
                        <FaPen className='text-[1.1rem]' />
                    </button>
                </p>

                {/* description */}
                <div className='relative'>
                    <details
                        ref={(el) => {
                            refs.view.description = el;
                        }}
                    >
                        <summary className='cursor-pointer w-max'>
                            Profile description
                        </summary>
                        <p className='mt-2 text-[#969696]'>{description}</p>
                    </details>
                    <textarea
                        onKeyPress={(e) => {
                            viewMode(e, 'description');
                        }}
                        onBlur={(e) => {
                            viewMode(e, 'description');
                        }}
                        className='hidden w-full'
                        ref={(el) => {
                            refs.inputs.description = el;
                        }}
                        defaultValue={description}
                    ></textarea>
                    <button
                        ref={(el) => {
                            refs.buttons.description = el;
                        }}
                        onClick={(e) => {
                            editMode(e, 'description');
                        }}
                        className='absolute top-0 left-[167px] inline ml-6 text-primary'
                    >
                        <FaPen className='text-[1.1rem]' />
                    </button>
                </div>
            </section>

            <hr className='w-1/5 mx-auto my-11 border-none bg-[#eee] h-[1px]' />

            <Snippets />
        </div>
    );
}
