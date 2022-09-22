import {Router, Outlet, ReactLocation} from 'react-location';
import SharedLayout from './pages/shared/sharedLayout';
import Login from './pages/login';
import SignUp from './pages/signup';
// import Home from './pages/home';
// import About from './pages/about';
// import Projects from './pages/projects';

import './index.css';

const routes = [
    {path: '/login', element: <Login />},
    {path: '/signup', element: <SignUp />},
    // {path: '/about', element: <About/>},
    // {path: '/projects/:id', element: ()=>import('./pages/projects').then((module)=><module.default/>)},
    // {path: '/projects/', element: ()=>{import('./pages/projects').then((module)=><module.default/>)} }
];

const location = new ReactLocation();

function App() {
    return (
        <Router routes={routes} location={location}>
            <div className="stupidDiv h-[100vh]">
                <SharedLayout>
                    <Outlet />
                </SharedLayout>
            </div>
        </Router>
    );
}

export default App;
