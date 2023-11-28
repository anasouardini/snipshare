import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './router';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './state/store';

// import {Router, Outlet, ReactLocation} from 'react-location';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import SharedLayout from './pages/shared/sharedLayout';
import Signin from './pages/signin';
import SignUp from './pages/signup';
import Home from './pages/home';
import Profile from './pages/profile';
import AddRules from './pages/coworkerRules';
import { QueryClient, QueryClientProvider } from 'react-query';

const NotFoundPage = () => (
  <section className={'h-[100vh] h-[100dvh] flex justify-center items-center'}>
    <p className={'text-2xl text-primary'}>Nothing To See Here (404)</p>
  </section>
);

function App() {
  const client = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
  });

  return (
    <QueryClientProvider client={client}>
      <ReduxProvider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<SharedLayout />}>
              <Route index element={<Home />} />
              <Route path='/login' element={<Signin />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='/addRules' element={<AddRules />} />
              <Route path='/user/:user' element={<Profile />} />
              <Route path='*' element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ReduxProvider>
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>
);
