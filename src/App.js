import React,{useState} from 'react';
import './styles/App.css'
import Header from './components/Header';
import List from './pages/List';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskStatistics from './pages/TaskStatistics'

function App() {
  const [completedTask, setCompletedTask] = useState(0)
  const [notCompletedTask, setNotCompletedTask] = useState(0)
  const addCompleted = (num) => {
    setCompletedTask(num)
  }
  const addNotCompleted = (num) => {
    setNotCompletedTask(num)
  }
  return (
    <div className= 'App'>
      <Header/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<List addCompleted={addCompleted} addNotCompleted={addNotCompleted}/>} />
          <Route path="/statistics" element={<TaskStatistics completedTask={completedTask} notCompletedTask={notCompletedTask}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
