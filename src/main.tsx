import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router";
import './index.css'

// Components
import DashboardLayout from "./components/layouts/DashboardLayout.tsx";

// Pages
import Home from './Home.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
        <Route path='/' element={<DashboardLayout/>}>
            <Route index={true} element={<Home/>}/>
        </Route>
    </Routes>
  </BrowserRouter>,
)
