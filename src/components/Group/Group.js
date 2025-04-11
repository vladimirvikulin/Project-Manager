import React, { useState } from 'react';
import AddTaskForm from '../AddTaskForm/AddTaskForm.js';
import { Link } from "react-router-dom";
import Task from '../Task/Task';
import MyButton from '../ui/button/MyButton';
import styles from './Group.module.css';
import MyModal from '../ui/modal/MyModal';
import { useDispatch } from 'react-redux';
import { fetchDeleteTask, fetchUpdateGroup, fetchUpdateTask } from '../../redux/slices/groups';

const Group = ({
    group,
    setStatistics,
    removeGroup, 
}) => {
    const { _id: groupId, title: groupTitle, tasks } = group;
    const dispatch = useDispatch();
    const [edit, setEdit] = useState(null);
    const [value, setValue] = useState('');
    const [duration, setDuration] = useState(1);
    const [deadline, setDeadline] = useState('');
    const [modalTaskVisible, setModalTaskVisible] = useState(false);

    const checkCompleted = (group) => {
        let completed = 0;
        let notCompleted = 0;
        tasks.map((i) => i.status ? ++notCompleted : ++completed);
        const updatedGroup = {
            ...group,
            completed,
            notCompleted,
        };
        dispatch(fetchUpdateGroup({ updatedGroup, groupId }));
        setStatistics(updatedGroup);
    };
    
    const removeTask = (task) => {
        const taskId = task._id;
        dispatch(fetchDeleteTask({ groupId, taskId }));
    };
    
    const statusTask = (task) => {
        const updatedTask = {
            ...task,
            status: !task.status
        };
        const taskId = task._id;
        dispatch(fetchUpdateTask({ updatedTask, groupId, taskId }));
    };

    const editTask = (task) => {
        setEdit(task._id);
        setValue(task.title);
        setDuration(task.duration || 1);
        setDeadline(task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '');
    };
    
    const saveTask = (task) => {
        const updatedTask = {
            ...task,
            title: value,
            duration: Number(duration),
            deadline: deadline ? new Date(deadline).toISOString() : undefined,
        };
        const taskId = task._id;
        setEdit(null);
        setValue('');
        setDuration(1);
        setDeadline('');
        dispatch(fetchUpdateTask({ updatedTask, groupId, taskId }));
    };

    const priorityTask = (task) => {
        const updatedTask = {
            ...task,
            priority: !task.priority
        };
        const taskId = task._id;
        dispatch(fetchUpdateTask({ updatedTask, groupId, taskId }));
    };

    return (
        <div>
            <div>
                <Link className={styles.link} to='/statistics/'>
                    <MyButton onClick={() => checkCompleted(group)}>Статистика групи</MyButton>
                </Link>
            </div>
            <h1 className={styles.groupHeader}>{groupTitle}</h1>
            <MyButton onClick={() => setModalTaskVisible(true)}>
                Створити задачу
            </MyButton>
            <MyModal visible={modalTaskVisible} setVisible={setModalTaskVisible}>
                <AddTaskForm id={group._id} setVisible={setModalTaskVisible} />
            </MyModal>
            <MyButton onClick={() => removeGroup(group)}>
                Видалити групу
            </MyButton>
            {tasks.length ? 
                <div>
                    {tasks.map((task, index) => (
                        <Task 
                            removeTask={removeTask} 
                            statusTask={statusTask} 
                            priorityTask={priorityTask}
                            edit={edit} 
                            editTask={editTask} 
                            value={value} 
                            setValue={setValue} 
                            duration={duration}
                            setDuration={setDuration}
                            deadline={deadline}
                            setDeadline={setDeadline}
                            saveTask={saveTask}
                            number={index + 1} 
                            task={task} 
                            key={task._id}
                        />
                    ))}
                </div>
                : <h1 className={styles.groupHeader}>Список задач порожній</h1>
            }
        </div>
    );
};

export default Group;