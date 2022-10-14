import {Router, Outlet, ReactLocation} from 'react-location';
import SharedLayout from './pages/shared/sharedLayout';
import Login from './pages/signin';
import SignUp from './pages/signup';
// import Home from './pages/home';
// import About from './pages/about';
// import Projects from './pages/projects';

import Snippets from './pages/snippets';
import Home from './pages/home';

const routes = [
    {path: '/', element: <Home />},
    {path: '/login', element: <Login />},
    {path: '/signup', element: <SignUp />},
    {
        path: '/:user',
        loader: ({params: {user}}) => ({user}),
        children: [
            {path: '/', element: <></>},
            {path: '/snippets', element: <Snippets />},
        ],
    },
];

const location = new ReactLocation();

function App() {
    return (
        <Router routes={routes} location={location}>
            <div className="stupidDiv h-[100vh]">
                <SharedLayout>
                    <Outlet component={routes} />
                </SharedLayout>
            </div>
        </Router>
    );
}

export default App;