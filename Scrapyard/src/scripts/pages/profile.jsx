import React from 'react';
import Snippets from '../components/snippets';
//import {useOutletContext} from 'react-router';

export default function Profile() {
    //const {whoami} = useOutletContext();

    return (
        <div className='mt-12 w-full'>
            {/* todo: profile related info */}

            <Snippets />
        </div>
    );
}
