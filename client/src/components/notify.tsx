import { useEffect } from 'react';
import { FiInfo } from 'react-icons/fi';
import { VscError } from 'react-icons/vsc';
import { BiError } from 'react-icons/bi';

import {
  AnimatePresence,
  motion,
  useAnimate,
  usePresence,
} from 'framer-motion';

interface Props {
  order: number;
  type: 'info' | 'warning' | 'error';
  msg: 'string';
}
export default function Notify(props: Props) {
  // console.log('props', props);

  const classes = {
    container: `p-3 mb-3 rounded-md text-text font-bold
       w-max flex gap-3 items-center`,
  };

  const notificationTypeStyle = {
    info: 'bg-blue-400 text-[#222]',
    warning: 'bg-yellow-400  text-[#222]',
    error: 'bg-red-400 text-[#222]',
  };
  const notificationTypeIcons = {
    info: FiInfo,
    warning: BiError,
    error: VscError,
  };
  const IconComponent = notificationTypeIcons[props.type];

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     // hiding notification form the DOM before the parent unmounts it
  //   }, 2000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, []);

  return (
    <motion.div
      key={'silly yet important property'}
      initial={{ opacity: 0, x: 90 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 90 }}
      transition={{ duration: 0.3, delay: props.order * .1 }}
      aria-label='notification'
      className={`${classes.container} ${notificationTypeStyle[props.type]}`}
    >
      <IconComponent style={{ fontSize: '1.5rem' }} />
      <p>
        {typeof props.msg == 'string'
          ? props.msg
          : 'msg string was not provided'}
      </p>
    </motion.div>
  );
}
