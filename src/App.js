import React, { useState } from 'react';
import './styles/App.css'
import Header from './components/Header';
import List from './components/List';
import AddGroupForm from './components/AddGroupForm';

function App() {
  const [groups, setGroups] = useState([])
  const addGroup = (newGroup) => {
    setGroups([...groups, newGroup])
  }
  return (
    <div className= 'App'>
      <Header groups = {groups}/>
      <AddGroupForm addGroup = {addGroup}/>
      {groups.length
        ? <List groups={groups}/>
        : <h1 className="list">Список груп порожній</h1>
      }
    </div>
  );
}

export default App;
