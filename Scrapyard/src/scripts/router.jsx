import {Router, Outlet, ReactLocation} from 'react-location';
import SharedLayout from './pages/shared/sharedLayout';
import Signin from './pages/signin';
import SignUp from './pages/signup';
import Snippets from './pages/snippets';
import Home from './pages/home';
import AddRules from './pages/coworkerRules';
import {QueryClient, QueryClientProvider} from 'react-query';

const routes = [
    {path: '/', element: <Home />},
    {path: '/signin', element: <Signin />},
    {path: '/signup', element: <SignUp />},
    {path: '/addRules', element: <AddRules />},
    {
        path: '/:user',
        loader: ({params: {user}}) => ({user}),
        children: [
            {path: '/', element: <></>},
            {path: '/snippets', element: <Snippets />},
        ],
    },
];

function App() {
    const location = new ReactLocation();
    const client = new QueryClient();

    return (
        <QueryClientProvider client={client}>
            <Router routes={routes} location={location}>
                <div className=" h-[100vh]">
                    <SharedLayout>
                        <Outlet component={routes} />
                    </SharedLayout>
                </div>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
