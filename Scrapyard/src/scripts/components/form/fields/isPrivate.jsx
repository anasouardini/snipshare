import React from 'react';
import {forwardRef} from 'react';

const IsPrivate = (props, ref) => {
    // console.log(props);
    return (
        <>
            <input
                ref={ref}
                // onChange={() => {}}
                type='checkbox'
                {...props}
                style={{display: 'inline'}}
            />
            &nbsp; private
        </>
    );
};

export default forwardRef(IsPrivate);
