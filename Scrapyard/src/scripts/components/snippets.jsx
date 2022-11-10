import React, {useState, useRef, useEffect, useCallback} from 'react';
import Snippet from '../components/snippet';
// import {useNavigate, useMatch} from 'react-location';
import {useParams, useOutletContext} from 'react-router-dom';
import Form from '../components/form/form';

import {commonSnippetFields, getSnippets} from '../tools/snipStore';
import {useNavigate} from 'react-router-dom';
import {useInfiniteQuery} from 'react-query';
import debouncer from '../tools/debouncer';
import autoAnimate from '@formkit/auto-animate';

export default function Snippets() {
    const navigate = useNavigate();

    const parentRef = useRef();
    useEffect(() => {
        // don't attach to the dom if the reference in null
        parentRef.current && autoAnimate(parentRef.current);
    }, [parentRef.current]);

    const {whoami} = useOutletContext();

    const {user: userParam} = useParams();

    const [searchState, setSearchState] = useState({title: ''});

    const [popUpState, setPopUpState] = useState({
        showForm: false,
        showPreview: false,
    });

    const {
        data: snippetsPages,
        fetchNextPage,
        status,
        error,
        refetch: refetchSnippets,
    } = useInfiniteQuery(
        ['snippets'],
        ({pageParam = 1}) =>
            getSnippets({user: userParam, title: searchState.title, pageParam, perPage: 3}),
        {
            getNextPageParam: (lastPage) => lastPage.nextPage,
        }
    );

    const handleSearch = (e) => {
        e.preventDefault();

        debouncer.run('snippetsSearch', e.target.value);
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
                    fetchNextPage();
                }
            }
        };
        window.addEventListener('scroll', onScroll);

        debouncer.init(
            'snippetsSearch',
            (title) => {
                setSearchState({title: title});
            },
            500
        );

        return () => {
            debouncer.clear('snippetsSearch');
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    useEffect(() => {
        if (status == 'success') {
            refetchSnippets();
        }
    }, [userParam, searchState.title]);

    if (error?.req?.status == 401) {
        return navigate('/login', {replace: true});
    }

    const [formFieldsState] = useState({
        fields: Object.values(structuredClone({commonSnippetFields}))[0],
    });

    // console.log(commonSnippetFields);

    const handleCreate = (e) => {
        e.stopPropagation();
        e.preventDefault();
        //mount form

        setPopUpState({...popUpState, showForm: true});
    };

    const refetchSnippetsCB = useCallback(refetchSnippets);
    const listSnippets = (snippetsPages) => {
        // console.log(status);
        return snippetsPages.pages.map((page) => {
            return page.snippets.map((snippet) => {
                return <Snippet key={snippet.id} snippet={snippet} update={refetchSnippetsCB} />;
            });
        });
    };

    const hidePopUp = (popUp) => {
        let newState = {...popUpState};
        if (popUp == 'form') {
            newState.showForm = false;
        } else {
            newState.showPreview = false;
        }

        setPopUpState(newState);
    };

    console.log('rendering snippets');
    if (status == 'success') {
        console.log('sdfsd', snippetsPages.pages[0]);
    }
    return status == 'success' ? (
        <div
            ref={parentRef}
            className='flex flex-col items-center justify-stretch px-3 gap-7 mx-auto'
        >
            <div className='w-full max-w-[600px] flex justify-between flex-wrap my-5 gap-4'>
                {whoami == userParam ||
                snippetsPages.pages?.[0]?.snippets?.[0]?.genericAccess?.create ||
                !userParam ? (
                    <button
                        onClick={handleCreate}
                        className={`border-[1px] border-lime-300 px-2 py-2 text-[1rem] text-lime-300 rounded-md`}
                    >
                        Add Snippet
                    </button>
                ) : (
                    <></>
                )}

                <label className=''>
                    <input
                        type='text'
                        onChange={handleSearch}
                        placeholder='find your sippet'
                        className='w-full max-w-[260px] px-3 py-2 border-[1px] border-primary rounded-md'
                    />
                </label>
            </div>
            {listSnippets(snippetsPages)}

            {popUpState.showForm ? (
                <Form
                    action='create'
                    fields={formFieldsState.fields}
                    hidePopUp={hidePopUp}
                    owner={userParam ? userParam : whoami}
                    refetch={refetchSnippets}
                />
            ) : (
                <></>
            )}
        </div>
    ) : (
        <></>
    );
}
