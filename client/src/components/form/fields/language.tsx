import React, { Ref, RefAttributes } from 'react';
import { useQuery } from 'react-query';
import { forwardRef } from 'react';
import { getLanguages } from '../../../tools/snipStore';

interface Props {
  filter: () => undefined;
  attr: {};
  defaultValue?: string;
  setFieldValue: (name: string, value: any) => void;
}
const Language = (props: Props, ref: React.LegacyRef<HTMLInputElement>) => {
  // console.log(props);

  const { data: languages, status: languagesStatus } = useQuery(
    'languages',
    () => getLanguages(),
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('lagnguages changing...');
    props.setFieldValue('language', e.target.value);
    if (props?.filter) {
      props.filter();
      // if (languages.includes(e.currentTarget.value)) {
      //     props.filter();
      // }
    }
  };

  const inputProps = {};
  if (props.attr) {
    Object.keys(props.attr).forEach((propKey) => {
      if (propKey != 'value') {
        inputProps[propKey] = props.attr[propKey];
      }
    });
  }
  return (
    <>
      <input
        {...inputProps}
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
