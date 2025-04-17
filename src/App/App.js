import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { fetchAuthMe } from '../redux/slices/auth';
import './App.css';
import Header from '../components/Header/Header';
import List from '../pages/List/List';
import TaskStatistics from '../pages/TaskStatistics/TaskStatistics';
import TaskNetwork from '../pages/TaskNetwork/TaskNetwork';
import Login from '../pages/Login/Login';
import Registration from '../pages/Registration/Registration';

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchAuthMe());
    }, [dispatch]);

    return (
        <div className='App'>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<List />} />
                    <Route path="/statistics" element={<TaskStatistics />} />
                    <Route path="/network" element={<TaskNetwork />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Registration />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;