import React, { useState } from 'react';
import './styles/App.css'
import Header from './components/Header';
import List from './components/List';
import AddTaskForm from './components/AddTaskForm';

function App() {
  const [tasks, setTasks] = useState (
    [
      {id: 1, title: 'Один', status: true},
      {id: 2, title: 'Два', status: true},
      {id: 3, title: 'Три', status: true},
    ]
  )
  
  const addTask = (newTask) => {
    setTasks([...tasks, newTask])
  }
  return (
    <div className= 'App'>
      <Header/>
      <AddTaskForm add={addTask}/>
      <List title = {'Список 1'} tasks = {tasks}/>
    </div>
  );
}

export default App;
