import React from 'react';
import {setAlteredSnippet} from '../../../tools/snipStore';

export default function IsPrivate(props) {
    const handleCheckBox = (e) => {
        e.stopPropagation();
        setAlteredSnippet({IsPrivate: e.target.checked});
    };

    return (
        <label>
            <input className="mr-1" onChange={handleCheckBox} type="checkbox" />
            private
        </label>
    );
}
