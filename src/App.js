import React,{useMemo, useState} from 'react';
import './styles/App.css'
import Header from './components/Header';
import List from './pages/List';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskStatistics from './pages/TaskStatistics'
import { connect } from 'react-redux';
import { setCompleted, setNotCompleted, setLocalGroups } from './db/store';

function App(props) {
  const [groups, setGroups] = useState([])
  const [selectedSort, setSelectedSort] = useState('')
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
  const sorted = useMemo ( () => {
      if (selectedSort === 'groupTitle') return [...groups].sort((a, b) => a['title'].localeCompare(b['title']))
      else if (selectedSort === 'taskTitle') {
        [...groups].map((g) => g.tasks.sort((a, b) => a['title'].localeCompare(b['title'])))
        return groups
    }
    return groups
  }, [selectedSort, groups])

  const sort = (sort) => {
    setSelectedSort(sort)
  }

  return (
    <div className= 'App'>
      <Header/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
          <List 
            groups={sorted} setGroups={setGroups} addGroup={addGroup} removeGroup={removeGroup}
            addCompleted={addCompleted} addNotCompleted={addNotCompleted} 
            setLocalGroups={props.setLocalGroups} localGroups={props.localGroups}
            selectedSort={selectedSort} sort={sort}/>} 
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
