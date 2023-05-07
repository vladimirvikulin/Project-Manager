import React, {useState} from 'react';

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
                <button onClick = {addNewTask}>Додати задачу</button>
            </form>
        </div>
    );
};

export default AddTaskForm;