import React, { useState } from 'react';
import AddTaskForm from './AddTaskForm';
import { Link } from "react-router-dom";
import Task from './Task';
import MyButton from './ui/button/MyButton';
import '../styles/List.css'

const ListGroup = ({group, groups, setGroups, removeGroup, addCompleted, addNotCompleted, setLocalGroups}) => {
    const [edit, setEdit] = useState(null)
    const [value, setValue] = useState('')

    const checkCompleted = () => {
        let completed = 0
        let notCompleted = 0
        group.tasks.map((i) => i.status ? ++notCompleted : ++completed)
        addCompleted(completed)
        addNotCompleted(notCompleted)
        setLocalGroups(groups)
    }
    
    const addTask = (newTask) => {
        group.tasks.push(newTask)
        setGroups([...groups])
    }
    
    const removeTask = (task) => {
        let i = group.tasks.indexOf(task);
        if(i >= 0) {
            group.tasks.splice(i,1);
        }
        setGroups([...groups])
    }
    
    const statusTask = (task) => {
        group.tasks.filter( i => {
            if (i.id === task.id) i.status = !i.status
            return i
          }
        )
        setGroups([...groups])
    }

    const editTask = (task) => {
        setEdit(task.id)
        setValue(task.title)
       }
    
    const saveTask = (task) => {
        group.tasks.filter( i => {
          if (i.id === task.id) i.title = value
          setEdit(null)
          setValue('')
          return i
        }
        )
        setGroups([...groups])
    }
    return (
        <div>
            <div className='link'>
              <Link onClick={checkCompleted} to='/statistics'>Статистика</Link>
            </div>
            <h1 className="list">{group.title}</h1>
            <AddTaskForm add={addTask}/>
            <MyButton onClick={() => removeGroup(group)}>
                  Видалити групу
               </MyButton>
            {group.tasks.length ? 
                <div>
                {group.tasks.map((task, index) => <Task 
                removeTask={removeTask} statusTask={statusTask} edit={edit} editTask={editTask} value={value} setValue={setValue} saveTask={saveTask}
                number={index + 1} task={task} key={task.id}/>)}
                 </div>
                : <h1 className="list">Список задач порожній</h1>
            }
        </div>
    );
};

export default ListGroup;