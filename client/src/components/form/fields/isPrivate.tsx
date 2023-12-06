import { forwardRef } from 'react';

interface Props {
  key: string;
  type: string;
  setFieldValue: (name: string, value: any) => void;
  attr: {};
}
const IsPrivate = (props: Props, ref: React.LegacyRef<HTMLInputElement>) => {
  const inputProps = {};
  Object.keys(props.attr).forEach((propKey) => {
    if (propKey != 'value') {
      inputProps[propKey] = props.attr[propKey];
    }
  });

  return (
    <>
      <input
        ref={ref}
        onChange={(e) => {
          props.setFieldValue('isPrivate', e.target.checked);
        }}
        {...inputProps}
        style={{ display: 'inline' }}
      />
      <span>private</span>
    </>
  );
};

export default forwardRef(IsPrivate);
