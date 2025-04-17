import React, { useState } from 'react';
import AddTaskForm from '../AddTaskForm/AddTaskForm.js';
import { Link } from "react-router-dom";
import Task from '../Task/Task';
import MyButton from '../ui/button/MyButton';
import MyInput from '../ui/input/MyInput';
import styles from './Group.module.css';
import MyModal from '../ui/modal/MyModal';
import { useDispatch } from 'react-redux';
import { fetchDeleteTask, fetchUpdateGroup, fetchUpdateTask } from '../../redux/slices/groups';

const Group = ({
    group,
    setStatistics,
    removeGroup, 
}) => {
    const { _id: groupId, title: groupTitle, tasks, executorCount } = group;
    const dispatch = useDispatch();
    const [edit, setEdit] = useState(null);
    const [value, setValue] = useState('');
    const [duration, setDuration] = useState(1);
    const [deadline, setDeadline] = useState('');
    const [dependencies, setDependencies] = useState([]);
    const [modalTaskVisible, setModalTaskVisible] = useState(false);
    const [editGroup, setEditGroup] = useState(false);
    const [editTitle, setEditTitle] = useState(groupTitle);
    const [editExecutorCount, setEditExecutorCount] = useState(executorCount || 2);

    const checkCompleted = (group) => {
        let completed = 0;
        let notCompleted = 0;
        const taskDurations = [];
        const missedDeadlines = [];
        const dependencyStats = { withDependencies: 0, withoutDependencies: 0 };

        tasks.forEach((task) => {
            task.status ? ++notCompleted : ++completed;

            const duration = task.duration || 1;
            const existingDuration = taskDurations.find(d => d.duration === duration);
            if (existingDuration) {
                existingDuration.count += 1;
            } else {
                taskDurations.push({ duration, count: 1 });
            }

            if (task.deadline) {
                const deadlineDate = new Date(task.deadline);
                const today = new Date();
                if (deadlineDate < today && task.status) {
                    const groupMissed = missedDeadlines.find(md => md.group === groupTitle);
                    if (groupMissed) {
                        groupMissed.count += 1;
                    } else {
                        missedDeadlines.push({ group: groupTitle, count: 1 });
                    }
                }
            }

            if (task.dependencies && task.dependencies.length > 0) {
                dependencyStats.withDependencies += 1;
            } else {
                dependencyStats.withoutDependencies += 1;
            }
        });

        taskDurations.sort((a, b) => a.duration - b.duration);

        const updatedGroup = {
            ...group,
            completed,
            notCompleted,
            taskDurations,
            missedDeadlines,
            dependencyStats,
        };
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
        setDependencies(task.dependencies || []);
    };
    
    const saveTask = (task) => {
        const updatedTask = {
            ...task,
            title: value,
            duration: Number(duration),
            deadline: deadline ? new Date(deadline).toISOString() : undefined,
            dependencies: dependencies || [],
        };
        const taskId = task._id;
        setEdit(null);
        setValue('');
        setDuration(1);
        setDeadline('');
        setDependencies([]);
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

    const saveGroup = () => {
        const updatedGroup = {
            ...group,
            title: editTitle,
            executorCount: Number(editExecutorCount),
        };
        dispatch(fetchUpdateGroup({ updatedGroup, groupId }));
        setEditGroup(false);
    };

    const taskOptions = tasks
        .filter(t => t._id !== (edit || ''))
        .map(task => ({
            value: task._id,
            name: task.title,
        }));

    return (
        <div>
            {editGroup ? (
                <div className={styles.editGroupForm}>
                    <MyInput 
                        value={editTitle} 
                        onChange={e => setEditTitle(e.target.value)} 
                        type="text" 
                        placeholder="Назва групи"
                    />
                    <MyInput 
                        value={editExecutorCount} 
                        onChange={e => setEditExecutorCount(e.target.value)} 
                        type="number" 
                        placeholder="Кількість виконавців"
                        min="1"
                    />
                    <MyButton onClick={saveGroup}>Зберегти</MyButton>
                </div>
            ) : (
                <div className={styles.groupHeaderWrapper}>
                    <h1 className={styles.groupHeader}>{groupTitle}</h1>
                </div>
            )}
            <MyButton onClick={() => setModalTaskVisible(true)}>
                Створити задачу
            </MyButton>
            <MyModal visible={modalTaskVisible} setVisible={setModalTaskVisible}>
                <AddTaskForm id={group._id} setVisible={setModalTaskVisible} />
            </MyModal>
            <MyButton onClick={() => removeGroup(group)}>
                Видалити групу
            </MyButton>
            <Link className={styles.link} to='/statistics/'>
                <MyButton onClick={() => checkCompleted(group)}>Статистика групи</MyButton>
            </Link>
            {!editGroup && (
                <MyButton onClick={() => setEditGroup(true)}>Редагувати групу</MyButton>
            )}
            <span className={styles.executorCount}>
                Виконавці: {executorCount}
            </span>
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
                            dependencies={dependencies}
                            setDependencies={setDependencies}
                            taskOptions={taskOptions}
                            tasks={tasks}
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