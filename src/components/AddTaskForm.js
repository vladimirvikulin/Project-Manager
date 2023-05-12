import React, {useState} from 'react';
import MyButton from './ui/button/MyButton';

const AddTaskForm = ({add}) => {
    const [title, setTitle] = useState('')
    const addNewTask = (e) => {
        e.preventDefault()
        const newTask = {
          id: Date.now(),
          title,
          status: true,
        }
        add(newTask)
        setTitle('')
      }
    return (
        <div>
            <form>
                <input 
                    value = {title} 
                    onChange = {e => setTitle(e.target.value)} 
                    type = 'text' 
                    placeholder = 'Назва задачі'
                />
                <MyButton onClick = {addNewTask}>Додати задачу</MyButton>
            </form>
        </div>
    );
};

export default AddTaskForm;