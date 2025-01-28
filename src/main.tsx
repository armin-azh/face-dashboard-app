import {createRoot} from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router";
import './index.css'

// Store Redux
import {Provider} from 'react-redux';
import {store} from "./store/store.tsx";

// Components
import DashboardLayout from "./components/layouts/DashboardLayout.tsx";

// Pages
import Home from './Home.tsx'
import Personals from "./Personals.tsx";
import Settings from "./Settings.tsx";
import Live from "./Live.tsx";
import Events from "./Events.tsx";
import Personal from "./Personal.tsx";
import Cameras from "./Cameras.tsx";
import Enrollment from "./Enrollment.tsx";

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<DashboardLayout/>}>
                    <Route index={true} element={<Home/>}/>
                    <Route path='/personals'>
                        <Route index={true} element={<Personals/>}/>
                        <Route path="personal/:prime" element={<Personal/>}/>
                        <Route path="personal/:prime/enrollments/enrollment/:enrollmentId" element={<Enrollment/>}/>
                    </Route>
                    <Route path='/cameras'>
                        <Route index={true} element={<Cameras/>}/>
                    </Route>
                    <Route path='/settings' element={<Settings/>}/>
                    <Route path='/live' element={<Live/>}/>
                    <Route path='/events' element={<Events/>}/>
                </Route>
            </Routes>
        </BrowserRouter>,
    </Provider>
)
