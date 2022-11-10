import React from 'react';
import {forwardRef} from 'react';

const IsPrivate = (props, ref) => {
    // console.log(props);
    return (
        <label>
            <input
                ref={ref}
                // onChange={() => {}}
                type="checkbox"
                {...props}
            />
            &nbsp; private
        </label>
    );
};

export default forwardRef(IsPrivate);
