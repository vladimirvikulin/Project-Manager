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
  const [filter, setFilter] = useState({selectedSort: '', searchGroup: ''})
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
  const sorted = useMemo (() => {
      if (filter.selectedSort === 'groupTitle') return [...groups].sort((a, b) => a['title'].localeCompare(b['title']))
      else if (filter.selectedSort === 'taskTitle') {
        [...groups].map((g) => g.tasks.sort((a, b) => a['title'].localeCompare(b['title'])))
        return groups
    }
    return groups
    }, [filter.selectedSort, groups])

  const sortedAndSearch = useMemo (() => {
    return sorted.filter(group => group.title.toLowerCase().includes(filter.searchGroup))
  }, [sorted, filter.searchGroup])

  return (
    <div className= 'App'>
      <Header/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
          <List 
            sortedAndSearch={sortedAndSearch} groups={groups} setGroups={setGroups} addGroup={addGroup} removeGroup={removeGroup}
            addCompleted={addCompleted} addNotCompleted={addNotCompleted} 
            setLocalGroups={props.setLocalGroups} localGroups={props.localGroups}
            filter={filter} setFilter={setFilter}
            />} 
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
