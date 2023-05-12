import React,{useState} from 'react';
import MyButton from './ui/button/MyButton';

const Task = (props) => {
   const [priority, setPriority] = useState(false)
   const priorityTask = () => {
      setPriority(!priority)
   }
    return (
     <div className={priority ? 'priorityTask' : 'task'}>
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
               <MyButton onClick={() => priorityTask(props.task)}>
                  Пріорітет
               </MyButton>    
               {props.number}. {props.task.title}
            </div>
         }
         {
         props.edit === props.task.id ? 
            <div>
               <MyButton onClick={() => props.saveTask(props.task)}>
                  Зберегти
               </MyButton>
            </div>
            :
            <div>
               <MyButton onClick={() => props.editTask(props.task)}>
                  Змінити
               </MyButton>
               <MyButton onClick={() => props.removeTask(props.task)}>
                  Видалити
               </MyButton>
               <MyButton onClick={() => props.statusTask(props.task)}>
                  {
                     props.task.status ? 'Закрити' : 'Відкрити'
                  }
               </MyButton>
            </div>
         }
    </div>
    );
};

export default Task;