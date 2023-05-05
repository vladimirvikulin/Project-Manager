import React from 'react';

const Task = (props) => {
    return (
     <div className="task">
         <div>
            {props.task.id} {props.task.title}
         </div>
         <div>
            <button>Змінити</button>
            <button>Видалити</button>
            <button>Закрити</button>
         </div>
    </div>
    );
};

export default Task;