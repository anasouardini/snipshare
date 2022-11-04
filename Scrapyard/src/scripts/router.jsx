// import {Router, Outlet, ReactLocation} from 'react-location';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import React from 'react'
import SharedLayout from './pages/shared/sharedLayout';
import Signin from './pages/signin';
import SignUp from './pages/signup';
import Home from './pages/home';
import Profile from './pages/profile';
import AddRules from './pages/coworkerRules';
import {QueryClient, QueryClientProvider} from 'react-query';

function App() {
    const client = new QueryClient();

    return (
        <QueryClientProvider client={client}>
            <div className=" h-[100vh]">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<SharedLayout />}>
                            <Route index element={<Home />} />
                            <Route path="/login" element={<Signin />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/addRules" element={<AddRules />} />
                            <Route path="/:user" element={<Profile />} />
                            <Route path="*" element={<p>not found</p>} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </div>
        </QueryClientProvider>
    );
}

export default App;
