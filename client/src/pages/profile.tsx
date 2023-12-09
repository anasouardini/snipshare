import React from 'react';
import Snippets from '../components/snippets';
import { useParams } from 'react-router-dom';
import { update, updateFile, read } from '../tools/bridge';
import { useOutletContext } from 'react-router-dom';
import { FaPen } from 'react-icons/fa';
import {
  AnimatePresence,
  motion,
  useAnimate,
  usePresence,
} from 'framer-motion';
import { useQuery } from 'react-query';
import { getUser } from '../tools/snipStore';
import Skeleton from '../components/skeleton';

export default function Profile() {
  const params: { user: string } = useParams();

  // const profileInfoRef: {
  //   username: string | undefined;
  //   description: string;
  //   avatar: { src: string; alt: string };
  // } = React.useRef({
  //   username: 'Pending...',
  //   description: 'Pending...',
  //   avatar: { src: '', alt: 'avatar' },
  // }).current;

  const refs = React.useRef({
    inputs: { username: null, description: null },
    view: {
      username: null,
      description: null,
      descriptionText: null,
      img: null,
    },
    buttons: { username: null, description: null },
    buttonHoverStyle: null,
  }).current;

  const { reload } = useOutletContext();

  const userInfo = useQuery('userInfo', () => {
    return getUser(params.user);
  });

  if (userInfo.status == 'success') {
    const { user, descr, avatar } = userInfo.data;

    // refs.view.img.src = avatar;
    // refs.view.img.alt = user + "'s avatar";
    // refs.view.username.innerText = user;
    // refs.view.descriptionText.innerText = descr;

    // refs.inputs.username.value = user;
    // refs.inputs.description.value = descr;

    // profileInfoRef.username = user;
    // profileInfoRef.description = descr;
    // profileInfoRef.avatar.src = avatar;
    // profileInfoRef.avatar.alt = user + "'s avatar";
  }

  const editMode = (e, inputName) => {
    refs['buttons'][inputName].classList.add('hidden');
    refs['view'][inputName].classList.add('hidden');

    refs['inputs'][inputName].classList.remove('hidden');
    refs['inputs'][inputName].focus();
  };

  const viewMode = async (e, inputName) => {
    if ((e.type == 'keypress' && e.key == 'Enter') || e.type == 'blur') {

      refs['buttons'][inputName].classList.remove('hidden');
      refs['view'][inputName].classList.remove('hidden');

      const input = refs['inputs'][inputName];
      input.classList.add('hidden');

      // nothing to Change
      if (input.value == userInfo.data[inputName]) {
        return;
      }

      const res = await update(`users`, {
        [inputName]: input.value,
      });
      if (res.status == 200) {
        refs['view'][inputName].innerText = input.value;
      }

      // to prevent any errors related to validating the user.
      // I probably should put the user's id in the JWT tokent in stead of the username
      if (inputName == 'username') {
        document.location.replace(`/login`);
      }
      // console.log(res);
    }
  };

  const fileChange = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append('avatar', file, file.name);
    const res = await updateFile(`users`, formData);

    if (res && res.status == 200) {
      reload();
    }
  };

  return (
    <div className='w-full '>
      {/* profile related info */}
      <motion.section
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        aria-label='profile info (editable)'
        className='mb-10 w-[90%] max-w-[600px] mx-auto'
      >
        {/* avatar */}
        <div aria-label='profile avatar' className={`mb-5`}>
          <style
            ref={(el) => {
              refs.buttonHoverStyle = el;
            }}
          >{`.profile-img:has(label):focus > label.invisible{visibility: visible}
                      .profile-img:has(label):hover > label.invisible{visibility: visible}`}</style>
          {userInfo.status == 'success' ? (
            <div
              tabIndex='0'
              aria-label='avatar'
              className={`profile-img relative flex justify-center items-center w-[90px]
                            h-[90px] border-primary border-[1px] rounded-[50%] mb-5 overflow-hidden`}
            >
              <img
                src={userInfo.data.avatar}
                alt={`${userInfo.data.username}'s profile picture.`}
                crossOrigin='anonymous'
                style={{ width: '90px', height: '90px' }}
                className='absolute top-0 left-0 bottom-0 right-0'
              />
              <label
                role='button'
                aria-label='change avatar'
                tabIndex='0'
                htmlFor='uploadBtn'
                className={`invisible focus:visible cursor-pointer
              z-10 bg-bg/60 shadow-2xl
              text-primary text-[.9rem] py-[3px] px-2
                border-primary border-2`}
              >
                Change
              </label>
              <input
                aria-hidden='true'
                tabIndex='-1'
                className='hidden'
                name='avatar'
                type='file'
                id='uploadBtn'
                onChange={(e) => {
                  fileChange(e);
                }}
                accept='.jpg, .jpeg, .png'
              />
            </div>
          ) : (
            <Skeleton type='avatar' className='w-20 h-20' />
          )}
        </div>

        {/* username */}
        {userInfo.status == 'success' ? (
          <p aria-label='profile username' className='mb-5 text-xl'>
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
              // value={userInfo.data.username}
              className='hidden w-[200px]'
              defaultValue={userInfo.data.username}
            />
            <span
              ref={(el) => {
                refs.view.username = el;
              }}
            >
              {userInfo.data.username}
            </span>
            <button
              aria-label='edit'
              ref={(el) => {
                refs.buttons.username = el;
              }}
              onClick={(e) => {
                editMode(e, 'username');
              }}
              className='inline ml-6 text-primary'
            >
              <FaPen aria-hidden='true' className='text-[1.1rem]' />
            </button>
          </p>
        ) : (
          <Skeleton type='title' className='mb-9' />
        )}

        {/* description */}
        {userInfo.status == 'success' ? (
          <div aria-label='profile description' className='relative'>
            <details
              ref={(el) => {
                refs.view.description = el;
              }}
            >
              <summary>
                Profile description
              </summary>
              <p
                className='mt-2 text-[#969696]'
                ref={(el) => {
                  refs.view.descriptionText = el;
                }}
              >
                {userInfo.data.description}
              </p>
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
              defaultValue={userInfo.data.description}
            />
            <button
              aria-label='edit'
              ref={(el) => {
                refs.buttons.description = el;
              }}
              onClick={(e) => {
                editMode(e, 'description');
              }}
              className='absolute top-0 left-[167px] inline ml-6 text-primary'
            >
              <FaPen aria-hidden='true' className='text-[1.1rem]' />
            </button>
          </div>
        ) : (
          <Skeleton type='paragraph' className='mb-9' />
        )}
      </motion.section>

      <hr className='w-1/5 mx-auto my-11 border-none bg-[#eee] h-[1px]' />

      <Snippets />
    </div>
  );
}
