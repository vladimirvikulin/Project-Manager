import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { fetchAuthMe } from '../redux/slices/auth';
import './App.css';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import List from '../pages/List/List';
import TaskStatistics from '../pages/TaskStatistics/TaskStatistics';
import TaskNetwork from '../pages/TaskNetwork/TaskNetwork';
import Login from '../pages/Login/Login';
import Registration from '../pages/Registration/Registration';
import Invitations from '../pages/Invitations/Invitations';
import Profile from '../pages/Profile/Profile';
import GanttChart from '../pages/GanttChart/GanttChart';
import Footer from '../components/Footer/Footer';
import { useSelector } from 'react-redux';
import { selectAuthData } from '../redux/slices/auth';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children, showMenuButton = true }) => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const authData = useSelector(selectAuthData);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setSidebarVisible(false);
    }, [location.pathname]);

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <div className="mainContent">
            <Header toggleSidebar={toggleSidebar} showMenuButton={showMenuButton} />
            <div className="contentWrapper">
                {showMenuButton && (
                    <Sidebar 
                        isOpen={sidebarVisible} 
                        toggleSidebar={toggleSidebar} 
                        authData={authData} 
                        navigate={navigate} 
                    />
                )}
                <main className={showMenuButton && sidebarVisible ? 'sidebar-open' : ''}>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
};

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAuthMe());
    }, [dispatch]);

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout><List /></Layout>} />
                    <Route path="/statistics" element={<Layout><TaskStatistics /></Layout>} />
                    <Route path="/network" element={<Layout><TaskNetwork /></Layout>} />
                    <Route path="/gantt" element={<Layout><GanttChart /></Layout>} />
                    <Route path="/login" element={<Layout showMenuButton={false}><Login /></Layout>} />
                    <Route path="/register" element={<Layout showMenuButton={false}><Registration /></Layout>} />
                    <Route path="/invitations" element={<Layout><Invitations /></Layout>} />
                    <Route path="/profile" element={<Layout><Profile /></Layout>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;