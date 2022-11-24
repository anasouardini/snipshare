import React from 'react';
import {useQuery} from 'react-query';
import {forwardRef} from 'react';
import {getLanguages} from '../../../tools/snipStore';

const IsPrivate = (props, ref) => {
    // console.log(props);

    const {data: languages, status: languagesStatus} = useQuery('languages', () => getLanguages());
    const [dataListOptionsState, setDataListOptionsState] = React.useState({
        languages: [],
    });

    const handleChange = (e) => {
        if (props?.filter) {
            if (languages.includes(e.currentTarget.value)) {
                props.filter();
            }
        }
    };
    return (
        <>
            <input
                type='text'
                placeholder='language'
                defaultValue={props?.defaultValue}
                onChange={
                    (languagesStatus == 'success'
                        ? handleChange
                        : () => {
                              console.log('error while gtting languages');
                          })
                }
                ref={ref}
                list='languages'
                className={`bg-transparent w-full max-w-[280px] px-3 py-2
                            border-[1px] border-primary rounded-md`}
            />
            <datalist id='languages'>
                {languagesStatus == 'success' ? (
                    languages.map((opt) => {
                        return <option key={opt} value={opt}></option>;
                    })
                ) : (
                    <></>
                )}
            </datalist>
        </>
    );
};

export default forwardRef(IsPrivate);
