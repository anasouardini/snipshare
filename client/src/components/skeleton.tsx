import React, { ReactElement } from 'react';

interface Props {
  type?: 'paragraph' | 'title' | 'avatar' | 'button';
  className?: string;
  style?: {};
  children?: React.ReactNode;
}
const Skeleton = (props: Props) => {
  // tailwing classing
  const classes = {
    base: 'bg-bg2 animate-pulse',
    title: 'h-[1.5rem] w-[250px] rounded-lg',
    avatar: 'h-[50px] w-[50px] rounded-[50%]',
    button: 'h-[20px] w-[60px] rounded-md',
    default: 'h-[100px] w-full rounded-md',
    pargraph: 'h-[1rem] w-full rounded-lg',
  };

  return (
    <div
      className={`
          ${classes.base}
          ${classes[props.type] ?? classes['default']}
          ${props.className ?? ''}
        `}
      style={props.style}
    >
      {props.children}
    </div>
  );
};

export default Skeleton;
