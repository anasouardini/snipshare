import React, {useState, useRef, useEffect, useCallback} from 'react';
import Snippet from '../components/snippet';
// import {useNavigate, useMatch} from 'react-location';
import {useParams, useOutletContext} from 'react-router-dom';
import Form from '../components/form/form';

import {commonSnippetFields, getSnippets, getCategories} from '../tools/snipStore';
import {useNavigate} from 'react-router-dom';
import {useInfiniteQuery, useQuery} from 'react-query';
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

    const [snippetsFilterState, setSnippetFilterState] = useState({
        title: '',
        categories: '',
        language: '',
    });

    const [popUpState, setPopUpState] = useState({
        showForm: false,
        showPreview: false,
    });

    const categoriesInputRef = useRef();
    const languageInputRef = useRef();
    const searchInputRef = useRef();

    const {data: categories, status: categoriesStatus} = useQuery('categories', () =>
        getCategories()
    );
    const [dataListOptionsState, setDataListOptionsState] = useState({
        categories: [],
    });
    // aweful way to do it
    const categoriesReadyRef = useRef(false);
    if (categoriesStatus == 'success' && !categoriesReadyRef.current) {
        setDataListOptionsState({categories: categories});
        categoriesReadyRef.current = true;
    }

    const {
        data: snippetsPages,
        fetchNextPage,
        status,
        error,
        refetch: refetchSnippets,
    } = useInfiniteQuery(
        ['snippets'],
        ({pageParam = 1}) =>
            getSnippets({
                user: userParam,
                title: snippetsFilterState.title,
                categories: snippetsFilterState.categories,
                language: snippetsFilterState.language,
                pageParam,
                perPage: 3,
            }),
        {
            getNextPageParam: (lastPage) => lastPage.nextPage,
        }
    );

    const handleSearch = (e) => {
        e.preventDefault();

        debouncer.run(
            'snippetsFilter',
            searchInputRef.current.value,
            categoriesInputRef.current.value,
            languageInputRef.current.value
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
                    fetchNextPage();
                }
            }
        };
        window.addEventListener('scroll', onScroll);

        debouncer.init(
            'snippetsFilter',
            (title, categories, language) => {
                console.log('filtering...', {title, categories, language});
                setSnippetFilterState({title, categories, language});
            },
            500
        );

        return () => {
            debouncer.clear('snippetsFilter');
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    useEffect(() => {
        if (status == 'success') {
            refetchSnippets();
        }
    }, [
        userParam,
        snippetsFilterState.title,
        snippetsFilterState.language,
        snippetsFilterState.categories,
    ]);

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

    // console.log('rendering snippets');
    if (status == 'success') {
        // console.log('sdfsd', snippetsPages.pages[0]);
    }

    const languageFilterChange = () => {
        debouncer.run(
            'snippetsFilter',
            searchInputRef.current.value,
            categoriesInputRef.current.value,
            languageInputRef.current.value
        );
    };

    const handleMultiSelectInputChange = (inputType, e) => {
        if (categoriesStatus != 'success') {
            return;
        }

        let inputValue = e.currentTarget.value;
        const separator = ',';

        if (!inputValue) {
            console.log('input emptied');
            return setDataListOptionsState({[inputType]: categories});
        }

        // determine if the user is asking for the next category
        const readyForSuggestion = (inp) => {
            if (inp[inp.length - 1] != ',' || inp == ',' || inp == ' ' || inp.includes(',,')) {
                console.log('bad pattern (, | ,,)');
                return false;
            }
            return true;
        };
        if (!readyForSuggestion(inputValue)) {
            return;
        }

        // remove last separator which is the last char
        inputValue = inputValue.substr(0, inputValue.length - 1);
        //clean input categories from spaces
        const inputList = inputValue.split(separator).map((inputCategory) => inputCategory.trim());

        const isOutOfRange = inputList.some((iputCategory) => {
            // if one of them is not in the list, input is out of range
            if (!categories.includes(iputCategory.trim())) return true;
        });
        if (isOutOfRange) {
            // console.log(inputList);
            console.log('category does not exist');
            return setDataListOptionsState({[inputType]: categories});
        }

        // determine if there is no suggestion left
        // console.log('ref list', categories);
        // console.log('input list', inputList);
        let end = categories.every((optRef) => {
            return inputList.includes(optRef);
        });
        if (end) {
            console.log('you have covered all of them');
            return;
        }

        // determine which <option>s need to stay with the input as a prefix
        const cleanOptionsList = categories.reduce((acc, opt) => {
            if (!inputList.includes(opt)) {
                acc.push(`${inputValue}${separator} ${opt}`.trim());
            }
            return acc;
        }, []);

        debouncer.run(
            'snippetsFilter',
            searchInputRef.current.value,
            categoriesInputRef.current.value,
            languageInputRef.current.value
        );

        setDataListOptionsState({[inputType]: cleanOptionsList});
    };

    return status == 'success' ? (
        <div
            ref={parentRef}
            className='flex flex-col items-center justify-stretch px-3 gap-7 mx-auto'
        >
            <div
                aria-label='controls'
                className='w-full max-w-[600px] flex justify-between
                                  items-center flex-wrap my-5 gap-3'
            >
                {whoami == userParam ||
                snippetsPages.pages?.[0]?.snippets?.[0]?.genericAccess?.create ||
                !userParam ? (
                    <button
                        onClick={handleCreate}
                        className={`border-[1px] border-lime-300 px-2 py-2
                                text-[1rem] text-lime-300 rounded-md`}
                    >
                        Add Snippet
                    </button>
                ) : (
                    <></>
                )}

                {/* todo: load all languages and categories*/}
                {/* todo: distinguish between adding snippets and filtering them*/}
                <input
                    type='text'
                    placeholder='language'
                    ref={languageInputRef}
                    onChange={languageFilterChange}
                    list='languages'
                    className='w-full max-w-[160px] px-3 py-2
                            border-[1px] border-primary rounded-md'
                />
                <datalist id='languages'>
                    <option key='javascript' value='javascript'>
                        javascript
                    </option>
                </datalist>

                <input
                    type='text'
                    placeholder='categories'
                    ref={categoriesInputRef}
                    list='categories'
                    multiple
                    onChange={(e) => {
                        handleMultiSelectInputChange('categories', e);
                    }}
                    className='w-full max-w-[280px] px-3 py-2
                            border-[1px] border-primary rounded-md'
                />
                <datalist id='categories'>
                    {dataListOptionsState['categories'].map((opt) => {
                        return <option key={opt} value={opt}></option>;
                    })}
                </datalist>

                {/* search with title */}
                <label>
                    <input
                        type='text'
                        ref={searchInputRef}
                        onChange={handleSearch}
                        placeholder='find your sippet'
                        className='w-full max-w-[260px] px-3 py-2
                                border-[1px] border-primary rounded-md'
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
