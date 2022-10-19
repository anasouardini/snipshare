import React from 'react';
import {forwardRef} from 'react';

const IsPrivate = forwardRef((props, ref) => {
    // console.log(props);
    return (
        <label>
            <input
                ref={ref}
                // onChange={() => {}}
                type="checkbox"
                {...props}
            />
            private
        </label>
    );
});

export default IsPrivate;
