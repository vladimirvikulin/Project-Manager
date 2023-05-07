import React from 'react';

const Task = (props) => {
    return (
     <div className="task">
         <div className={!props.task.status ? 'close' : ''}>
            {props.number}. {props.task.title}
         </div>
         <div>
            <button>Змінити</button>
            <button onClick={() => props.remove(props.task)}>
               Видалити
            </button>
            <button onClick={() => props.status(props.task)}>
               {
                  props.task.status ? 'Закрити' : 'Відкрити'
               }
               
            </button>
         </div>
    </div>
    );
};

export default Task;