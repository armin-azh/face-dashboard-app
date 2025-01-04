import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router";
import './index.css'

// Components
import DashboardLayout from "./components/layouts/DashboardLayout.tsx";

// Pages
import Home from './Home.tsx'
import Personals from "./Personals.tsx";
import Settings from "./Settings.tsx";
import Live from "./Live.tsx";
import Events from "./Events.tsx";

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
        <Route path='/' element={<DashboardLayout/>}>
            <Route index={true} element={<Home/>}/>
            <Route path='/personals' element={<Personals/>}/>
            <Route path='/settings' element={<Settings/>}/>
            <Route path='/live' element={<Live/>}/>
            <Route path='/events' element={<Events/>}/>
        </Route>
    </Routes>
  </BrowserRouter>,
)
