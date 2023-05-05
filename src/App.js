import React, { useState } from 'react';
import './styles/App.css'
import Header from './components/Header';
import List from './components/List';

function App() {
  const [tasks, setTasks] = useState (
    [
      {id: 1, title: 'Один', status: true},
      {id: 2, title: 'Два', status: true},
      {id: 3, title: 'Три', status: true},
    ]
  )
  return (
    <div className= 'App'>
      <Header/>
    <List title={'Список 1'} tasks={tasks}/>
    </div>
  );
}

export default App;
