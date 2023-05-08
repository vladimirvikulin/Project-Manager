import React, { useState } from 'react';
import AddTaskForm from './AddTaskForm';
import Task from './Task';

const ListGroup = ({group}) => {
    const [tasks, setTasks] = useState ([])
    const [edit, setEdit] = useState(null)
    const [value, setValue] = useState('')
    
    const addTask = (newTask) => {
        setTasks([...tasks, newTask])
    }
    
    const removeTask = (task) => {
        setTasks(tasks.filter(i => i.id !== task.id))
    }
    
    const statusTask = (task) => {
        setTasks(tasks.filter( i => {
            if (i.id === task.id) i.status = !i.status
            return i
          }
        ))
    }
    const editTask = (task) => {
        setEdit(task.id)
        setValue(task.title)
       }
    
    const saveTask = (task) => {
        setTasks(tasks.filter( i => {
          if (i.id === task.id) i.title = value
          setEdit(null)
          setValue('')
          return i
        }
      ))
    }
    return (
        <div>
            <h1 className="list">{group.title}</h1>
            <AddTaskForm add={addTask}/>
            {tasks.length ? 
                <div>
                {tasks.map((task, index) => <Task 
                removeTask={removeTask} statusTask={statusTask} edit={edit} editTask={editTask} value={value} setValue={setValue} saveTask={saveTask}
                number={index + 1} task={task} key={task.id}/>)}
                 </div>
                : <h1 className="list">Список задач порожній</h1>
            }
        </div>
    );
};

export default ListGroup;