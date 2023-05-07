import React from 'react';
import Task from './Task';

const List = ({remove, status, title, edit, editTask, value, setValue, save, tasks}) => {
    return (
        <div>
            <h1 className="list">{title}</h1>
            {tasks.map((task, index) => <Task 
            remove={remove} status={status} edit={edit} editTask={editTask} value={value} setValue={setValue} save={save}
            number={index + 1} task={task} key={task.id}/>)}
        </div>
    );
};

export default List;