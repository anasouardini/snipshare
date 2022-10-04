import React, {useRef} from 'react';
import {create} from '../tools/bridge';
import {useNavigate} from 'react-location';

export default function SignUp() {
    const navigate = useNavigate();

    const refs = {
        username: useRef('username'),
        password: useRef('password'),
    };

    const createUser = async () => {
        const response = await create('signup', {
            usr: refs.username.current.value,
            passwd: refs.password.current.value,
        });

        if (response) {
            // console.log('success');
            console.log(response);
            if (response.status == 200) {
                navigate({to: '/login', replace: true});
            }
            return;
        }

        console.log('not success :)');
        console.log(response);
        // console.log(create);
    };

    const classes = {
        parent: `border-3 w-[500px] mx-auto mt-40`,
        title: `text-center text-3xl mb-[50px] relative
                before:content-[""] before:absolute before:top-[105%] before:w-10 before:h-1 before:bg-lime-600`,
        form: 'flex flex-col w-lg',
        input: 'p-[5px]',
        textInput: 'border-0 border-b-2 border-b-lime-600 outline-0',
        checkbox: 'w-xl mr-3',
        label: 'max-w-[300px] mx-auto',
        submit: 'w-full border-b-2 border-b-lime-600 mt-4 pb-2',
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createUser();
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
            <h1 className={classes.title}>Sign UP</h1>

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
                        Sign Up
                    </button>
                </label>
            </form>
        </div>
    );
}
