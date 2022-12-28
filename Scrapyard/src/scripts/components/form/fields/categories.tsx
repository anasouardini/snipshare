import React from 'react';
import {useQuery} from 'react-query';
import {forwardRef} from 'react';
import {getCategories} from '../../../tools/snipStore';

const Categories = (
    props: {filtering: boolean; debounceCB: () => undefined; defaultValue?: string},
    ref:React.LegacyRef<HTMLInputElement>
) => {
    // console.log(props);

    const {data: categories, status: categoriesStatus} = useQuery('categories', () =>
        getCategories()
    );
    const [dataListOptionsState, setDataListOptionsState] = React.useState([]);
    // aweful way to do it
    const categoriesReadyRef = React.useRef(false);
    if (categoriesStatus == 'success' && !categoriesReadyRef.current) {
        setDataListOptionsState(categories);
        categoriesReadyRef.current = true;
    }

    const handleMultiSelectInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (props?.debounceCB) props.debounceCB();

        if (categoriesStatus != 'success') {
            return;
        }

        let inputValue = e.currentTarget.value;
        const separator = ',';

        if (!inputValue) {
            // console.log('input emptied');
            return setDataListOptionsState(categories);
        }

        // determine if the user is asking for the next category
        const readyForSuggestion = (inp: string) => {
            if (
                inp[inp.length - 1] != ',' ||
                inp == ',' ||
                inp == ' ' ||
                inp.includes(',,')
            ) {
                // console.log('bad pattern (, | ,,)');
                return false;
            }
            return true;
        };
        if (!readyForSuggestion(inputValue)) {
            return;
        }

        // remove last separator which is the last char
        inputValue = inputValue.substring(0, inputValue.length - 1);
        //clean input categories from spaces
        const inputList = inputValue
            .split(separator)
            .map((inputCategory) => inputCategory.trim());

        const isOutOfRange = inputList.some((iputCategory) => {
            // if one of them is not in the list, input is out of range
            if (!categories.includes(iputCategory.trim())) return true;
        });
        if (isOutOfRange) {
            // console.log(inputList);
            // console.log('category does not exist');
            return setDataListOptionsState(categories);
        }

        // determine if there is no suggestion left
        // console.log('ref list', categories);
        // console.log('input list', inputList);
        let end = categories.every((optRef: string) => {
            return inputList.includes(optRef);
        });
        if (end) {
            // console.log('you have covered all of them');
            return;
        }

        // determine which <option>s need to stay with the input as a prefix
        const cleanOptionsList = categories.reduce((acc: string[], opt: string) => {
            if (!inputList.includes(opt)) {
                acc.push(`${inputValue}${separator} ${opt}`.trim());
            }
            return acc;
        }, []);


        // console.log(cleanOptionsList);
        setDataListOptionsState(cleanOptionsList);
    };
    // console.log(props);

    return (
        <>
            <label>
                <input
                    type='text'
                    placeholder='categories'
                    defaultValue={props?.defaultValue}
                    ref={ref}
                    list='categories'
                    onChange={(e) => {
                        handleMultiSelectInputChange( e);
                    }}
                    className={`${props.filtering ? '' : 'relative z-20'}
                            bg-transparent w-full max-w-[280px] px-3 py-2
                            border-[1px] border-primary rounded-md`}
                />
            </label>
            <datalist id='categories'>
                {dataListOptionsState.map((opt) => {
                    return <option key={opt} value={opt}></option>;
                })}
            </datalist>
        </>
    );
};

export default forwardRef(Categories);
