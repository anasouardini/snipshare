interface Props {
  type?: 'paragraph' | 'title' | 'avatar' | 'button';
  className?: string;
}
const Skeleton = (props: Props) => {
  // tailwing classing
  const classes = {
    base: 'bg-gray-500 animate-pulse',
    title: 'h-1rem w-[150px] rounded-lg',
    avatar: 'h-[30px] w-[30px] rounded-[50%]',
    button: 'h-[15px] w-[40px] rounded-md',
    default: 'h-[100px] w-full rounded-md',
    pargraph: 'h-1rem w-full rounded-lg',
  };

  return (
    <div
      className={`
        ${classes.base}
        ${classes[props.type] ?? ''}
        ${props.className ?? ''}
        `}
    ></div>
  );
};

export default Skeleton;
