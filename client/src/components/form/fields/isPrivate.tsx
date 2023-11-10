import {forwardRef} from 'react';

const IsPrivate = (props:{key: string, type:string}, ref) => {
    // console.log(props);
    return (
        <>
            <input
                ref={ref}
                // onChange={() => {}}
                {...props}
                style={{display: 'inline'}}
            />
            &nbsp; private
        </>
    );
};

export default forwardRef(IsPrivate);
