import React, {useState, useEffect} from 'react';
import {useQuery} from 'react-query';
import {useNavigate, useOutletContext, useParams} from 'react-router';
import Form from '../components/form/form';
import Snippets from '../components/snippets';

import {commonSnippetFields, getSnippets, getUsers} from '../tools/snipStore';

export default function Home() {
    const [popUpState, setPopUpState] = useState({
        showForm: false,
        showPreview: false,
    });


    // const navigate = useNavigate();
    // const {user: userParam} = useParams();

    const {whoami} = useOutletContext();
    // if (whoami == '' || whoami == 'unauthorized') {
    //     console.log('redirecting');
    //     return navigate('/login', {replace: true});
    // }

    // const {
    //     data: users,
    //     status: getUsersStatus,
    //     error: getUsersErr,
    // } = useQuery(['users'], () => {
    //     return getUsers();
    // });
    // if (getUsersErr?.req?.status == 401) {
    //     return navigate('/login', {replace: true});
    // }
    // console.log(users);

    // console.log(users, getUsersStatus, getUsersErr);
    return (
        <div className="mt-12 w-full">
            <Snippets />
        </div>
    ) ;
}
