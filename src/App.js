import React from 'react';
import './styles/App.css'
import Header from './components/Header';
import List from './pages/List';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskStatistics from './pages/TaskStatistics'
import { connect } from 'react-redux';
import { setCompleted, setNotCompleted } from './db/store';

function App(props) {
  const addCompleted = (num) => {
    props.setCompleted(num)
  }
  const addNotCompleted = (num) => {
    props.setNotCompleted(num)
  }
  return (
    <div className= 'App'>
      <Header/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<List addCompleted={addCompleted} addNotCompleted={addNotCompleted}/>} />
          <Route path="/statistics" element={<TaskStatistics completedTask={props.completed} notCompletedTask={props.notCompleted}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    completed: state.completed,
    notCompleted: state.notCompleted
  }
}

export default connect(mapStateToProps, { setCompleted, setNotCompleted })(App);
