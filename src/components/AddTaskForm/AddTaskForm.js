import React, { useState } from 'react';
import MyButton from '../ui/button/MyButton';
import MyInput from '../ui/input/MyInput';
import MyCheckboxList from '../ui/checkbox/MyCheckboxList';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCreateTask } from '../../redux/slices/groups';
import { selectGroups } from '../../redux/slices/groups';

const AddTaskForm = ({ setVisible, id }) => {
    const [title, setTitle] = useState('');
    const [dependencies, setDependencies] = useState([]);
    const [duration, setDuration] = useState(1);
    const [deadline, setDeadline] = useState('');
    const dispatch = useDispatch();
    const { groups } = useSelector(selectGroups);
    const group = groups.items.find(g => g._id === id);

    const addNewTask = (e) => {
        e.preventDefault();
        const newTask = {
            title,
            status: true,
            priority: false,
            dependencies: dependencies || [],
            duration: Number(duration),
            deadline: deadline ? new Date(deadline).toISOString() : undefined,
        };
        dispatch(fetchCreateTask({ newTask, id }));
        setVisible(false);
        setTitle('');
        setDependencies([]);
        setDuration(1);
        setDeadline('');
    };

    const taskOptions = group?.tasks.map(task => ({
        value: task._id,
        name: task.title,
    })) || [];

    return (
        <div>
            <form>
                <MyInput 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    type="text" 
                    placeholder="Назва задачі" 
                />
                <MyInput 
                    value={duration} 
                    onChange={e => setDuration(e.target.value)} 
                    type="number" 
                    placeholder="Тривалість (дні)" 
                    min="1" 
                />
                <MyInput 
                    value={deadline} 
                    onChange={e => setDeadline(e.target.value)} 
                    type="date" 
                    placeholder="Дедлайн (опціонально)" 
                />
                <MyCheckboxList
                    value={dependencies}
                    onChange={setDependencies}
                    label="Залежності (опціонально)"
                    options={taskOptions}
                />
                <MyButton onClick={addNewTask}>Додати задачу</MyButton>
            </form>
        </div>
    );
};

export default AddTaskForm;