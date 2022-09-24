import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import LocalShop from './tools/localShop';

LocalShop.load();

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <App />
    // </React.StrictMode>
);
