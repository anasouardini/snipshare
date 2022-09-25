import React, {useRef} from 'react';
import {create} from '../tools/bridge';
import LocalShop from '../tools/localShop';
import {useNavigate} from 'react-location';

export default function Login() {
    const navigate = useNavigate();
    // if (LocalShop.checkLogin()) {
    //     navigate({to: './shop', replace: true});
    // }

    const refs = {
        username: useRef('username'),
        password: useRef('password'),
        keepSignIn: useRef('keepSignIn'),
    };
    1;
    const handleSubmit = (e) => {
        e.preventDefault();
        getUser(); //asyn
    };

    const getUser = async () => {
        const response = await create('login', {
            usr: refs.username.current.value,
            passwd: refs.password.current.value,
            keepSignIn: refs.keepSignIn.value,
        });

        if (response) {
            if (response.authenticated) {
                console.log('render shop route');
            }
            console.log('success');
            console.log(response);
            return;
        }

        console.log('not success :)');
        console.log(response);
        // console.log(create);
    };

    const classes = {
        parent: 'border-3 w-[500px] mx-auto mt-40',
        title: `text-center text-3xl mb-[50px] relative
                before:content-[""] before:absolute before:top-[105%] before:w-10 before:h-1 before:bg-lime-600`,
        form: 'flex flex-col w-lg',
        input: 'p-[5px]',
        textInput: 'border-0 border-b-2 border-b-lime-600 outline-0',
        checkbox: 'w-xl mr-3',
        label: 'max-w-[300px] mx-auto',
        submit: 'w-full border-2 border-lime-600 px-[20px]',
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
            <h1 className={classes.title}>Login</h1>

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
                    <input
                        className={`${classes.input} ${classes.checkbox}`}
                        ref={refs.keepSignIn}
                        type="checkbox"
                        name="keepSignIn"
                    />
                    Keep Log In
                </label>

                <label className={classes.label}>
                    <button className={classes.submit} onClick={handleSubmit}>
                        Log In
                    </button>
                </label>
            </form>
        </div>
    );
}
