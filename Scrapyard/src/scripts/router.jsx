// import {Router, Outlet, ReactLocation} from 'react-location';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SharedLayout from './pages/shared/sharedLayout';
import Signin from './pages/signin';
import SignUp from './pages/signup';
import Snippets from './pages/snippets';
import Home from './pages/home';
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
                            <Route path="/:user/snippets" element={<Snippets />} />
                            <Route path="*" element={<p>not found</p>} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </div>
        </QueryClientProvider>
    );
}

export default App;
