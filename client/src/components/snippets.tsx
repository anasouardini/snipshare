import React, { useState, useRef, useEffect, useCallback } from 'react';
import Snippet from '../components/snippet';
// import {useNavigate, useMatch} from 'react-location';
import { useParams, useOutletContext } from 'react-router-dom';
import Form from '../components/form/form';

import { commonSnippetFields, getSnippets } from '../tools/snipStore';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from 'react-query';
import debouncer from '../tools/debouncer';
import Categories from '../components/form/fields/categories';
import Language from '../components/form/fields/language';

export default function Snippets() {
  const navigate = useNavigate();

  const parentRef = useRef<HTMLInputElement>(null);

  const { whoami } = useOutletContext();

  const { user: userParam } = useParams();

  const [snippetsFilterState, setSnippetFilterState] = useState<{
    title: string | undefined;
    categories: string | undefined;
    language: string | undefined;
  }>({
    title: '',
    categories: '',
    language: '',
  });

  const [popUpState, setPopUpState] = useState({
    showForm: false,
    showPreview: false,
  });

  const categoriesInputRef = useRef<HTMLInputElement>(null);
  const languageInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const snippets = useInfiniteQuery(
    ['snippets'],
    ({ pageParam = 1 }) =>
      getSnippets({
        user: userParam,
        title: snippetsFilterState.title,
        categories: snippetsFilterState.categories,
        language: snippetsFilterState.language,
        pageParam,
        perPage: 3,
      }),
    {
      getNextPageParam: lastPage => lastPage.nextPage,
    },
  );
  // if(snippets.status == 'success'){console.log(snippets.data)}

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    debouncer.run(
      'snippetsFilter',
      searchInputRef.current?.value,
      categoriesInputRef.current?.value,
      languageInputRef.current?.value,
    );
  };

  useEffect(() => {
    const onScroll = () => {
      let fetching = false;
      if (!fetching) {
        fetching = true;
        const documentHeight = document.body.scrollHeight;
        const viewedContentHeight = document.documentElement.scrollTop;
        const viewportHeight = document.body.clientHeight;

        //console.log(documentHeight - viewedContentHeight <= viewportHeight+400)
        if (documentHeight - viewedContentHeight <= viewportHeight * 1.5) {
          snippets.fetchNextPage();
        }
      }
    };
    window.addEventListener('scroll', onScroll);

    debouncer.init(
      'snippetsFilter',
      (
        title: string | undefined,
        categories: string | undefined,
        language: string | undefined,
      ) => {
        console.log('filtering...', { title, categories, language });
        setSnippetFilterState({ title, categories, language });

        return undefined;
      },
      500,
    );

    return () => {
      debouncer.clear('snippetsFilter');
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (snippets.status == 'success') {
      snippets.refetch();
    }
  }, [
    userParam,
    snippetsFilterState.title,
    snippetsFilterState.language,
    snippetsFilterState.categories,
  ]);

  if (snippets.error?.req?.snippets.status == 401) {
    return navigate('/login', { replace: true });
  }

  const [formFieldsState] = useState({
    fields: Object.values(structuredClone({ commonSnippetFields }))[0],
  });

  // console.log(commonSnippetFields);

  const handleCreate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    //mount form

    setPopUpState({ ...popUpState, showForm: true });
  };

  const refetchSnippetsCB = useCallback(snippets.refetch, []);
  const listSnippets = () => {
    // console.log(snippets.status);
    type snippetType = {
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
    return snippets.data?.pages.map((page: { snippets: snippetType[] }) => {
      return page.snippets.map(snippet => {
        return (
          <Snippet
            key={snippet.id}
            snippet={snippet}
            update={refetchSnippetsCB}
          />
        );
      });
    });
  };

  const hidePopUp = () => {
    let newState = { ...popUpState };
    newState.showForm = false;

    setPopUpState(newState);
    return undefined;
  };

  // console.log('rendering snippets');
  if (snippets.status == 'success') {
    // console.log('sdfsd', snippets.data.pages[0]);
  }

  const languageFilterChange = () => {
    debouncer.run(
      'snippetsFilter',
      searchInputRef.current?.value,
      categoriesInputRef.current?.value,
      languageInputRef.current?.value,
    );
    return undefined;
  };

  // providing a debouncer cb for categories component
  const debounceCB = () => {
    debouncer.run(
      'snippetsFilter',
      searchInputRef.current?.value,
      categoriesInputRef.current?.value,
      languageInputRef.current?.value,
    );
    return undefined;
  };

  return snippets.status == 'success' ? (
    <section
      aria-label='code snippets'
      ref={parentRef}
      className='flex flex-col items-center
                justify-stretch px-3 gap-7 pt-10 mx-auto'
    >
      <div
        aria-label='controls'
        className='w-full max-w-[600px] flex justify-between
                  items-center flex-wrap my-5 gap-3'
      >
        {whoami == userParam ||
        snippets.data.pages?.[0]?.genericAccess?.create ||
        !userParam ? (
          <button
            onClick={handleCreate}
            className={`border-[1px] border-primary px-2 py-2
                        text-[1rem] text-primary rounded-md`}
          >
            Add Snippet
          </button>
        ) : (
          <></>
        )}

        {/* todo: ux - distinguish between adding snippets and filtering them*/}
        <Language ref={languageInputRef} filter={languageFilterChange} />

        <Categories
          ref={categoriesInputRef}
          debounceCB={debounceCB}
          filtering={true}
        />

        {/* search with title */}
        <label>
          <input
            type='text'
            ref={searchInputRef}
            onChange={handleSearch}
            placeholder='find your sippet'
            className='w-full max-w-[280px] px-3 py-2
                      border-[1px] border-primary rounded-md'
          />
        </label>
      </div>
      {listSnippets()}

      {/* todo: suspense this with lazy loading */}
      {popUpState.showForm ? (
        <Form
          action='create'
          fields={formFieldsState.fields}
          hidePopUp={hidePopUp}
          owner={userParam ? userParam : whoami}
          refetch={snippets.refetch}
        />
      ) : (
        <></>
      )}
    </section>
  ) : (
    <></>
  );
}
