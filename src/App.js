import React,{ useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { fetchAuthMe } from './redux/slices/auth';
import Header  from './components/Header/Header';
import List from './pages/ToDoList/List';
import TaskStatistics from './pages/TaskStatistics'
import Login from './pages/Login/Login';
import Registration from './pages/Registration/Registration';


function App() {
	const dispatch = useDispatch();
	useEffect(() => {
        dispatch(fetchAuthMe());
    }, []);
	return (
    	<div className= 'App'>
      	<BrowserRouter>
		  	<Header/>
        	<Routes>
          		<Route path="/" element={<List />}/>
          		<Route path="/statistics" element={<TaskStatistics/>}/>
				<Route path="/login" element={<Login/>}/>
				<Route path="/register" element={<Registration/>}/>
			</Routes>
      	</BrowserRouter>
    	</div>
  	);
}

export default App;