import React, { useState } from 'react';
import MyButton from '../ui/button/MyButton';
import MyInput from '../ui/input/MyInput';
import { useDispatch } from 'react-redux';
import { fetchCreateGroup, fetchGroups } from '../../redux/slices/groups';

const AddGroupForm = ({ setModalGroupVisible }) => {
    const [title, setTitle] = useState('');
    const [executorCount, setExecutorCount] = useState(2);
    const dispatch = useDispatch();

    const addNewGroup = (e) => {
        e.preventDefault();
        const newGroup = {
            title,
            tasks: [],
            completed: 0,
            notCompleted: 0,
            executorCount: Number(executorCount),
        };
        dispatch(fetchCreateGroup(newGroup))
            .then(() => {
                dispatch(fetchGroups());
                setModalGroupVisible(false);
                setTitle('');
                setExecutorCount(2);
            })
            .catch((error) => {
                alert(error.response?.data?.message || 'Помилка при створенні групи');
            });
    };

    return (
        <div>
            <form>
                <MyInput 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    type="text" 
                    placeholder="Назва групи"
                />
                <MyInput 
                    value={executorCount} 
                    onChange={e => setExecutorCount(e.target.value)} 
                    type="number" 
                    placeholder="Кількість виконавців"
                    min="1"
                />
                <MyButton onClick={addNewGroup}>Додати групу</MyButton>
            </form>
        </div>
    );
};

export default AddGroupForm;