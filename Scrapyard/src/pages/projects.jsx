import React from 'react';
import { useMatch } from 'react-location';

export default function Projects() {
    const params = useMatch().params;
    // console.log(params);
    
    return (
        <div>Projects {params.id ? params.id : ''}</div>
    )
}
