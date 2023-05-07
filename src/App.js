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

  const removeTask = (task) => {
    setTasks(tasks.filter(i => i.id !== task.id))
  }

  const statusTask = (task) => {
    setTasks(tasks.filter( i => {
        if (i.id === task.id) {
          i.status = !i.status
        }
        return i
      }
    ))
  }

  return (
    <div className= 'App'>
      <Header/>
      <AddTaskForm add={addTask}/>
      {tasks.length
        ? <List remove={removeTask} status={statusTask} title = {'Список 1'} tasks = {tasks}/>
        : <h1 className="list">Список задач порожній</h1>
      }
    </div>
  );
}

export default App;
