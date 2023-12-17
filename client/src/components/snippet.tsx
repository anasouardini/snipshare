import React, { useState, memo, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import { commonSnippetFields, getUser } from '../tools/snipStore';
import { read, remove } from '../tools/bridge';
import CustomForm from './form/form';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import CodeSnippet from './form/fields/snippet';
import { Tooltip } from 'react-tooltip';
import * as yup from 'yup';
import { useQuery } from 'react-query';
import Skeleton from './skeleton';

type propsT = {
  snippet: {
    id: string;
    user: string;
    title: string;
    descr: string;
    snippet: string;
    isPrivate: Boolean;
    author: string;
    language: string;
    categories: string;
    access: { read: Boolean; update: Boolean; delete: Boolean };
  };
};

function Snippet(props: propsT) {
  const { notify } = useOutletContext();

  const [snipInfoState, setSnipInfoState] = useState({
    snippet: props.snippet,
  });
  // console.log(snipInfoState.snippet);

  const validationSchema = yup.object().shape({
    title: yup
      .string()
      .required('Title is required (1-100 characters)')
      .max(100),
    descr: yup
      .string()
      .required('Description is required (1-500 characters)')
      .max(500),
    isPrivate: yup.boolean(),
    snippet: yup.string().required('Snippet is required'),
    categories: yup.string().required(),
    language: yup.string().required(),
  });

  const [popUpState, setPopUpState] = useState({ showForm: false });

  // fetching avatar for the snippet
  // const avatarRef = useRef(null);
  // const fetchAvatar = async () => {
  //   const userInfo = await getUser(snipInfoState.snippet.user);
  //   // console.log(userInfo.avatar)
  //   if (avatarRef.current) {
  //     avatarRef.current.src = userInfo.avatar;
  //   }
  // };
  // useEffect(() => {
  //   fetchAvatar();
  // }, []);

  //* different query key just to show-case the skeleton
  const userInfo = useQuery(`snippet-${snipInfoState.snippet.user}`, () => {
    return getUser(snipInfoState.snippet.user);
  });

  const formFieldsState = useRef({
    fields: Object.values(structuredClone({ commonSnippetFields }))[0],
  });

  const updateFields = () => {
    formFieldsState.current.fields.forEach((field) => {
      if (field.attr.type == 'checkbox') {
        field.attr.defaultChecked = Boolean(
          snipInfoState.snippet[field.attr.key],
        );
        field.attr.defaultValue = Boolean(
          snipInfoState.snippet[field.attr.key],
        );
      } else {
        if (field.attr.type == 'snippet') {
          field.attr.readOnly = true;
        }
        // console.log(snipInfoState.snippet.id, snipInfoState.snippet[field.attr.key]);
        field.attr.defaultValue = snipInfoState.snippet[field.attr.key];
      }
    });
    //console.log(formFieldsState.current.fields);
  };

  // useEffect() would be better with this
  // I need to to modify some data before even running the jsx functions
  const firstRender = useRef(true);
  if (firstRender.current) {
    updateFields();
    firstRender.current = false;
  }
  // ditsh this: useEffect(() => {}, []);

  const handleEdit = (e) => {
    e.stopPropagation();
    if (snipInfoState.snippet.access?.update) {
      formFieldsState.current.fields.forEach((field) => {
        if (field.attr.type == 'snippet') {
          field.attr.readOnly = false;
        }
      });
      setPopUpState({ showForm: true });
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    // console.log('sdfkljsdfj');

    if (snipInfoState.snippet.access?.delete) {
      // console.log(snipInfoState.snippet);
      const response = await remove(
        snipInfoState.snippet.user + '/' + snipInfoState.snippet.id,
      );
      props.update();
      notify({ type: 'info', msg: response.msg });
    }
  };
  // console.log(snipInfoState.snippet);
  const classes = {
    buttons: 'flex justify-around mt-[20px]',
    button: `w-[100px] py-[4px] rounded-md
            hover:scale-105 transition-scale
            duration-200 ease-in-out`,
    btnEdit: `${
      snipInfoState.snippet.access?.update
        ? 'bg-lime-700 font-bold text-gray-200'
        : 'bg-gray-400 text-black font-bold cursor-not-allowed'
    }`,
    btnDelete: `${
      snipInfoState.snippet.access?.delete
        ? 'bg-red-700 font-bold text-gray-200'
        : 'bg-gray-400 font-bold text-black cursor-not-allowed'
    }`,
  };

  const updateEditedSnippet = async () => {
    const response = await read(
      `${snipInfoState.snippet.user}/${snipInfoState.snippet.id}`,
    );
    if (response?.status == 200) {
      // console.log('reading new version');

      // updateFields();
      firstRender.current = true; // to update the fields

      setSnipInfoState({ snippet: response.msg });
    }
  };
  const hidePopUp = () => {
    setPopUpState({ showForm: false });
  };

  // console.log(Object.values(formFieldsState.current.fields)[2].attr);
  // console.log(snipInfoState.snippet);
  return (
    <>
      <div
        data-key={snipInfoState.snippet.id}
        className={`bg-bg3 rounded-md w-full max-w-[600px]`}
      >
        <div className={`snippet flex flex-col max-w-[600px]  p-6`}>
          {/* Owner and Author and Privacy*/}
          <div className='flex justify-between mb-4 gap-3'>
            {/* Owner */}
            <div className='flex flex-row gap-3'>
              {userInfo.status == 'success' ? (
                <figure
                  className='border-primary border-[1px]
                          w-[50px] h-[50px] rounded-full
                          overflow-hidden'
                >
                  <img
                    className='w-full h-full'
                    crossOrigin='anonymous | use-credentials'
                    src={userInfo.data.avatar}
                  />
                </figure>
              ) : (
                <Skeleton type='avatar' />
              )}
              <p>
                <span>{snipInfoState.snippet.user}</span>
                <br />
                <span className='text-text2 text-sm'>
                  @{snipInfoState.snippet.user}
                </span>
              </p>
            </div>
            {/* Author */}
            {snipInfoState.snippet.author != snipInfoState.snippet.user ? (
              <div className='grow-2'>
                Author: @{snipInfoState.snippet.author}
              </div>
            ) : (
              <></>
            )}
            {/* is Private */}
            <p>
              {snipInfoState.snippet.isPrivate ? (
                <>
                  <FaLock
                    data-tooltip-id='private'
                    data-tooltip-content='Private'
                    className='text-orange-500'
                  />
                  <Tooltip id='private' />
                </>
              ) : (
                <>
                  <FaLockOpen
                    data-tooltip-id='public'
                    data-tooltip-content='Public'
                    className='text-primary'
                  />
                  <Tooltip id='public' />
                </>
              )}
            </p>
          </div>
          {/* Title */}
          <h2 className='text-xl text-text mb-4'>
            {snipInfoState.snippet.title}
          </h2>

          {/* Description */}
          <details className='mb-4'>
            <summary className='mb-2 cursor-pointer w-max'>Description</summary>
            <p className='text-text2'>{snipInfoState.snippet.descr}</p>
          </details>
          <details className='mb-4'>
            <summary className='mb-2 cursor-pointer w-max'>Categories:</summary>
            <ul className='mr-3 flex flex-wrap'>
              {snipInfoState.snippet.categories.split(' ').map((category) => (
                <li
                  key={category}
                  className='inline ml-2 border-[1px]
                                          border-primary rounded-xl p-1 px-2'
                >
                  {category}
                </li>
              ))}
            </ul>
          </details>
          <h3 className='text-md text-text mb-3'>
            Snippet:
            <p className='inline ml-2 border-[1px] border-primary rounded-xl p-1 px-2'>
              {snipInfoState.snippet.language}
            </p>
          </h3>
          {/* Snippet */}
          <CodeSnippet
            attr={
              formFieldsState.current.fields.filter(
                (field) => field.type == 'CodeSnippet',
              )[0].attr
            }
            readOnly={true}
          />

          {/* Actions */}
          <div className={`${classes.buttons}`}>
            <button
              onClick={handleEdit}
              className={`${classes.button} ${classes.btnEdit}`}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className={`${classes.button} ${classes.btnDelete} `}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      {popUpState.showForm ? (
        <CustomForm
          action='edit'
          validationSchema={validationSchema}
          fields={formFieldsState.current.fields}
          hidePopUp={hidePopUp}
          snipId={snipInfoState.snippet.id}
          snipUser={snipInfoState.snippet.user}
          updateEditedSnippet={updateEditedSnippet}
        />
      ) : (
        <></>
      )}
    </>
  );
}
export default memo(Snippet);
