import React from 'react';

const Task = (props) => {
    return (
     <div className='task'>
         {
         props.edit === props.task.id ? 
            <div>
               <input 
                  value = {props.value} 
                  onChange = {e => props.setValue(e.target.value)} 
                  type = 'text' 
                  placeholder = 'Назва задачі'
               />
            </div>
            : 
            <div className={!props.task.status ? 'close' : ''}>         
               {props.number}. {props.task.title}
            </div>
         }
         {
         props.edit === props.task.id ? 
            <div>
               <button onClick={() => props.save(props.task)}>
                  Зберегти
               </button>
            </div>
            :
            <div>
               <button onClick={() => props.editTask(props.task)}>
                  Змінити
               </button>
               <button onClick={() => props.remove(props.task)}>
                  Видалити
               </button>
               <button onClick={() => props.status(props.task)}>
                  {
                     props.task.status ? 'Закрити' : 'Відкрити'
                  }
               </button>
            </div>
         }
    </div>
    );
};

export default Task;