import React from 'react';
import {setIsPrivate} from '../../../tools/snipStore';

export default function IsPrivate(props) {
    const handleCheckBox = (e) => {
        e.stopPropagation();
        setIsPrivate(e.target.checked);
    };

    return (
        <label>
            <input className="mr-1" onChange={handleCheckBox} type="checkbox" />
            private
        </label>
    );
}
