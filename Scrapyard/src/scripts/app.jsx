import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './router';
import '../styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <App />
    // </React.StrictMode>
);

// lab

// const toUrlEncoded = (obj) =>
//     '?' +
//     Object.keys(obj)
//         .reduce((acc, k) => {
//             if (obj[k]) {
//                 acc.push(`${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`);
//             }
//             return acc;
//         }, [])
//         .join('&');

// console.log(toUrlEncoded({title: NaN, desc: undefined, sdfkl: 'sdf', user: 'usename'}));
