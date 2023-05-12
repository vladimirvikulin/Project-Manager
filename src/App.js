import React,{useState} from 'react';
import './styles/App.css'
import Header from './components/Header';
import List from './pages/List';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskStatistics from './pages/TaskStatistics'
import { connect } from 'react-redux';
import { setCompleted, setNotCompleted, setLocalGroups } from './db/store';

function App(props) {
  const [groups, setGroups] = useState([])
  const addGroup = (newGroup) => {
    setGroups([...groups, newGroup])
  }
  const removeGroup = (group) => {
    setGroups(groups.filter(i => i.id !== group.id))
  }
  const addCompleted = (num) => {
    props.setCompleted(num)
  }
  const addNotCompleted = (num) => {
    props.setNotCompleted(num)
  }
  const loadGroupsFromLocal = () => {
    setGroups(props.localGroups)
  }
  return (
    <div className= 'App'>
      <Header/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
          <List 
            groups={groups} setGroups={setGroups} addGroup={addGroup} removeGroup={removeGroup}
            addCompleted={addCompleted} addNotCompleted={addNotCompleted} 
            setLocalGroups={props.setLocalGroups} localGroups={props.localGroups}/>} 
          />
          <Route path="/statistics" element={<TaskStatistics completedTask={props.completed} notCompletedTask={props.notCompleted} loadGroupsFromLocal={loadGroupsFromLocal}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    localGroups: state.groups,
    completed: state.completed,
    notCompleted: state.notCompleted
  }
}

export default connect(mapStateToProps, { setCompleted, setNotCompleted, setLocalGroups })(App);
