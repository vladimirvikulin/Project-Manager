import React from 'react';
import Task from './Task';

const List = ({remove, title, tasks}) => {
    return (
        <div>
            <h1 className="list">{title}</h1>
            {tasks.map((task, index) => <Task remove={remove} number={index + 1} task={task} key={task.id}/>)}
        </div>
    );
};

export default List;