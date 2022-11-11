import React from 'react';
import Snippets from '../components/snippets';
//import {useOutletContext} from 'react-router';

export default function Profile() {
    //const {whoami} = useOutletContext();

    return (
        <>
            <section className="suggested-profiles my-14 px-4">
                <h2 className="text-center text-2xl">Suggested Profiles</h2>
                <ul className="mt-4 mx-auto">
                    <li className="m-0">profile one</li>
                    <li className="m-0">profile two</li>
                </ul>
            </section>

            <Snippets />
        </>
    );
}
