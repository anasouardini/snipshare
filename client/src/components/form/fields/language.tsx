import React, { Ref, RefAttributes } from 'react';
import { useQuery } from 'react-query';
import { forwardRef } from 'react';
import { getLanguages } from '../../../tools/snipStore';

const Language = (
  props: { filter: () => undefined; defaultValue?: string },
  ref: React.LegacyRef<HTMLInputElement>,
) => {
  // console.log(props);

  const { data: languages, status: languagesStatus } = useQuery(
    'languages',
    () => getLanguages(),
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props?.filter) {
      props.filter();
      // if (languages.includes(e.currentTarget.value)) {
      //     props.filter();
      // }
    }
  };
  return (
    <>
      <label>
        <input
          type='text'
          placeholder='language'
          defaultValue={props?.defaultValue}
          onChange={
            languagesStatus == 'success'
              ? handleChange
              : () => {
                  console.log('error while gtting languages');
                }
          }
          ref={ref}
          list='languages'
          className={`bg-transparent w-full max-w-[280px] px-3 py-2
                            border-[1px] border-primary rounded-md`}
        />
      </label>
      <datalist id='languages'>
        {languagesStatus == 'success' ? (
          languages.map((lang: string) => {
            return <option key={lang} value={lang}></option>;
          })
        ) : (
          <></>
        )}
      </datalist>
    </>
  );
};

export default forwardRef(Language);
