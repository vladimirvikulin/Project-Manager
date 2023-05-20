import React,{useMemo, useState} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header  from './components/Header/Header';
import List from './pages/ToDoList/List';
import TaskStatistics from './pages/TaskStatistics'
import Login from './pages/Login/Login';
import Registration from './pages/Registration/Registration';


function App() {
  	const [groups, setGroups] = useState([]);
  	const [filter, setFilter] = useState({selectedSort: '', searchGroup: ''});
  	const [modalGroupVisible, setModalGroupVisible] = useState(false);
  	const addGroup = (newGroup) => {
    	setGroups([...groups, newGroup]);
    	setModalGroupVisible(false);
  	}
  	const removeGroup = (group) => {
    	setGroups(groups.filter((i) => i.id !== group.id));
  	}
  	const sorted = useMemo (() => {
      	if (filter.selectedSort === 'groupTitle') return [...groups].sort((a, b) => a['title'].localeCompare(b['title']));
      	else if (filter.selectedSort === 'taskTitle') {
        	[...groups].map((g) => g.tasks.sort((a, b) => a['title'].localeCompare(b['title'])));
        	return groups;
    	}
    	return groups
    }, [filter.selectedSort, groups]);

  	const sortedAndSearch = useMemo (() => {
    	return sorted.filter(group => group.title.toLowerCase().includes(filter.searchGroup));
  	}, [sorted, filter.searchGroup]);

  	return (
    	<div className= 'App'>
      	<BrowserRouter>
		  	<Header/>
        	<Routes>
          		<Route path="/" element={
          			<List 
            		sortedAndSearch={sortedAndSearch} groups={groups} setGroups={setGroups} 
            		addGroup={addGroup} removeGroup={removeGroup}
            		filter={filter} setFilter={setFilter}
            		modalGroupVisible={modalGroupVisible} setModalGroupVisible={setModalGroupVisible}
            		/>
          		} 
          		/>
          		<Route path="/statistics" element={
					<TaskStatistics/>}
				/>
				<Route path="/login" element={<Login/>}/>
				<Route path="/register" element={<Registration/>}/>
			</Routes>
      	</BrowserRouter>
    	</div>
  	);
}

export default App;