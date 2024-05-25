import React, {useState} from 'react';
import MyButton from '../ui/button/MyButton';
import MyInput from '../ui/input/MyInput';
import { useDispatch } from 'react-redux';
import { fetchCreateTask } from '../../redux/slices/groups';
import PropTypes from 'prop-types';

const AddTaskForm = ({setVisible, id}) => {
    const [title, setTitle] = useState('')
    const dispatch = useDispatch();
    const addNewTask = (e) => {
        e.preventDefault();
        const newTask = {
          title,
          status: true,
          priority: false,
        }
        dispatch(fetchCreateTask({newTask, id}));
        setVisible(false);
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

AddTaskForm.propTypes = {
    setVisible: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
};

export default AddTaskForm;