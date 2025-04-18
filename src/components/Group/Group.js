import React, { useState } from 'react';
import AddTaskForm from '../AddTaskForm/AddTaskForm.js';
import { useNavigate } from "react-router-dom";
import Task from '../Task/Task';
import MyButton from '../ui/button/MyButton';
import MyInput from '../ui/input/MyInput';
import styles from './Group.module.css';
import MyModal from '../ui/modal/MyModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeleteTask, fetchUpdateGroup, fetchUpdateTask, fetchInviteUser, fetchRemoveUser, fetchGroups } from '../../redux/slices/groups';
import { selectIsAuth, selectAuthData } from '../../redux/slices/auth';

const Group = ({
    group,
    removeGroup, 
}) => {
    const { _id: groupId, title: groupTitle, tasks, executorCount, members = [], user: ownerId } = group;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth);
    const authData = useSelector(selectAuthData);
    const isOwner = authData && ownerId && authData._id === ownerId.toString();
    const [edit, setEdit] = useState(null);
    const [value, setValue] = useState('');
    const [duration, setDuration] = useState(1);
    const [deadline, setDeadline] = useState('');
    const [dependencies, setDependencies] = useState([]);
    const [modalTaskVisible, setModalTaskVisible] = useState(false);
    const [editGroup, setEditGroup] = useState(false);
    const [editTitle, setEditTitle] = useState(groupTitle);
    const [editExecutorCount, setEditExecutorCount] = useState(executorCount || 2);
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');

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
            type: 'group',
        };
        navigate('/statistics', { state: { statistics: updatedGroup } });
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

    const handleInviteUser = (e) => {
        e.preventDefault();
        if (!inviteEmail) {
            alert('Введіть електронну адресу');
            return;
        }
        dispatch(fetchInviteUser({ groupId, email: inviteEmail }))
            .then(({ payload }) => {
                alert(payload.message);
                setInviteEmail('');
                setInviteModalVisible(false);
                dispatch(fetchGroups());
            })
            .catch((error) => {
                alert(error.response?.data?.message || 'Помилка при надсиланні запрошення');
            });
    };

    const handleRemoveUser = (userId) => {
        if (window.confirm('Ви впевнені, що хочете видалити цього користувача з групи?')) {
            dispatch(fetchRemoveUser({ groupId, userId }))
                .then(({ payload }) => {
                    alert(payload.message);
                    dispatch(fetchGroups());
                })
                .catch((error) => {
                    alert(error.response?.data?.message || 'Помилка при видаленні користувача');
                });
        }
    };

    const taskOptions = tasks
        .filter(t => t._id !== (edit || ''))
        .map(task => ({
            value: task._id,
            name: task.title,
        }));

    if (!isAuth) {
        return null;
    }

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
            {isOwner && (
                <>
                    <MyButton onClick={() => removeGroup(group)}>
                        Видалити групу
                    </MyButton>
                    <MyButton onClick={() => setInviteModalVisible(true)}>
                        Запросити користувача
                    </MyButton>
                </>
            )}
            <div className={styles.link}>
                <MyButton onClick={() => checkCompleted(group)}>Статистика групи</MyButton>
            </div>
            {!editGroup && isOwner && (
                <MyButton onClick={() => setEditGroup(true)}>Редагувати групу</MyButton>
            )}
            <span className={styles.executorCount}>
                Виконавці: {executorCount}
            </span>
            {Array.isArray(members) && members.length > 0 && (
                <div className={styles.membersList}>
                    <h3>Учасники:</h3>
                    <ul>
                        {members.map((member) => (
                            member && member._id ? (
                                <li key={member._id} className={styles.memberItem}>
                                    {member.fullName} ({member.email})
                                    {isOwner && member._id.toString() !== authData?._id && (
                                        <MyButton
                                            onClick={() => handleRemoveUser(member._id)}
                                            className={styles.removeMemberButton}
                                        >
                                            Видалити
                                        </MyButton>
                                    )}
                                </li>
                            ) : null
                        ))}
                    </ul>
                </div>
            )}
            <MyModal visible={inviteModalVisible} setVisible={setInviteModalVisible}>
                <div className={styles.inviteForm}>
                    <h3>Запросити користувача</h3>
                    <form onSubmit={handleInviteUser}>
                        <MyInput
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            type="email"
                            placeholder="Електронна адреса"
                        />
                        <MyButton type="submit">Надіслати запрошення</MyButton>
                    </form>
                </div>
            </MyModal>
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