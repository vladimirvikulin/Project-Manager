import React, {useState} from 'react';
import MyButton from './ui/button/MyButton';
import MyInput from './ui/input/MyInput';

const AddTaskForm = ({add}) => {
    const [title, setTitle] = useState('')
    const addNewTask = (e) => {
        e.preventDefault();
        const newTask = {
          id: Date.now(),
          title,
          status: true,
          priority: false,
        }
        add(newTask);
        setTitle('');
      }
    return (
        <div>
            <form>
                <MyInput 
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