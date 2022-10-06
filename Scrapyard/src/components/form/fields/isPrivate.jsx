import React from 'react';

export default function IsPrivate(props) {
    return (
        <label>
            <input className="mr-1" ref={refs.isPrivate} type="checkbox" />
            private
        </label>
    );
}
