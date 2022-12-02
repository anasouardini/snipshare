import React, {useRef} from 'react';
import {create, read} from '../tools/bridge';
import {useNavigate} from 'react-router';
import {useEffect} from 'react';

export default function Signin() {
    const navigate = useNavigate();

    const refs = {
        username: useRef<HTMLInputElement>(),
        password: useRef<HTMLInputElement>(),
    };

    const sendIdToken = async () => {
        const fragId = window.location.hash;
        if (fragId != '') {
            const idToken = fragId.split('&')[0].split('=')[1];
            // console.log('idToken', idToken);

            const response = await read(`api/auth/google?idToken=${idToken}`);
            if (response.status == 200) {
                navigate('/', {replace: true});
            }
        }
    };

    useEffect(() => {
        sendIdToken();
    }, []);

    const handleOAuth = (e:MouseEvent) => {
        e.preventDefault();

        window.open('http://127.0.0.1:2000/auth/google', '_self');
    };

    const handleSubmit = (e:MouseEvent) => {
        e.preventDefault();
        signIn(); //asyn
    };

    const signIn = async () => {
        const response = await create('signin', {
            usr: refs.username.current?.value,
            passwd: refs.password.current?.value,
        });

        if (response) {
            if (response.status == 200) {
                // console.log('redirect to home');
                return navigate('/');
            }
            // console.log('success');
            // console.log(response);
        }

        console.log('not success :)');
        console.log(response);
        // console.log(create);
    };

    const classes = {
        parent: 'border-3 w-[500px] mx-auto mt-40',
        title: `text-center text-3xl mb-[50px] relative
                before:content-[""] before:absolute before:top-[105%] 
                before:w-10 before:h-1 before:bg-primary`,
        form: 'flex flex-col w-lg',
        input: 'p-[5px]',
        textInput: 'border-0 border-b-2 border-b-primary outline-0',
        checkbox: 'w-xl mr-3',
        label: 'max-w-[300px] mx-auto',
        submit: 'w-full border-b-2 border-b-primary mt-4 pb-2',
        oauth: 'w-[200px] border-2 border-primary mt-4 p-2',
    };

    return (
        <div className={classes.parent}>
            <style>
                {`
                    label + label{
                        margin-top: 20px
                    }
                `}
            </style>
            <h1 className={classes.title}>SignIn</h1>

            <form className={classes.form}>
                <label className={classes.label}>
                    <input
                        placeholder="Username"
                        className={`${classes.input} ${classes.textInput}`}
                        ref={refs.username}
                        type="text"
                        name="username"
                    />
                </label>
                <label className={classes.label}>
                    <input
                        placeholder="Password"
                        className={`${classes.input} ${classes.textInput}`}
                        ref={refs.password}
                        type="password"
                        name="password"
                    />
                </label>

                <label className={classes.label}>
                    <button className={classes.submit} onClick={handleSubmit}>
                        Log In
                    </button>
                </label>
                <label className={classes.label}>
                    <button className={classes.oauth+' rounded-md'} onClick={handleOAuth}>
                        Login With Google
                    </button>
                </label>
            </form>
        </div>
    );
}
