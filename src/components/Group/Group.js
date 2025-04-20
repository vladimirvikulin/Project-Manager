import React, { useState } from 'react';
import AddTaskForm from '../AddTaskForm/AddTaskForm.js';
import { useNavigate } from "react-router-dom";
import Task from '../Task/Task';
import MyButton from '../ui/button/MyButton';
import MyInput from '../ui/input/MyInput';
import MyModal from '../ui/modal/MyModal';
import styles from './Group.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeleteTask, fetchUpdateGroup, fetchUpdateTask, fetchRemoveUser, fetchGroups } from '../../redux/slices/groups';
import { selectIsAuth, selectAuthData } from '../../redux/slices/auth';
import InviteUserForm from '../InviteUserForm/InviteUserForm';
import EditPermissionsForm from '../EditPermissionsForm/EditPermissionsForm';
import { FaPlus, FaTrash, FaChartBar, FaPencilAlt } from 'react-icons/fa';

const Group = ({
    group,
    removeGroup, 
}) => {
    const { _id: groupId, title: groupTitle, tasks, executorCount, members = [], user: ownerId, permissions = [] } = group;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth);
    const authData = useSelector(selectAuthData);
    const isOwner = authData && ownerId && authData._id === ownerId.toString();
    
    const userPermissions = permissions.find(perm => perm.userId === authData?._id) || {};
    const canAddTasks = isOwner || userPermissions.canAddTasks;
    const canEditTasks = isOwner || userPermissions.canEditTasks;
    const canDeleteTasks = isOwner || userPermissions.canDeleteTasks;

    const [edit, setEdit] = useState(null);
    const [value, setValue] = useState('');
    const [duration, setDuration] = useState(1);
    const [deadline, setDeadline] = useState('');
    const [dependencies, setDependencies] = useState([]);
    const [modalTaskVisible, setModalTaskVisible] = useState(false);
    const [editGroup, setEditGroup] = useState(false);
    const [editTitle, setEditTitle] = useState(groupTitle);
    const [editExecutorCount, setEditExecutorCount] = useState(executorCount || 2);
    const [permissionsState, setPermissionsState] = useState(
        members.reduce((acc, member) => ({
            ...acc,
            [member._id]: {
                canAddTasks: permissions.find(p => p.userId === member._id)?.canAddTasks || false,
                canEditTasks: permissions.find(p => p.userId === member._id)?.canEditTasks || false,
                canDeleteTasks: permissions.find(p => p.userId === member._id)?.canDeleteTasks || false,
            },
        }), {})
    );

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

    const handleRemoveUser = (userId) => {
        if (window.confirm('Ви впевнені, що хочете видалити цього користувача з групи?')) {
            dispatch(fetchRemoveUser({ groupId, userId }))
                .then(({ payload }) => {
                    alert(payload.message);
                    dispatch(fetchGroups());
                    setPermissionsState(prev => {
                        const newState = { ...prev };
                        delete newState[userId];
                        return newState;
                    });
                })
                .catch((error) => {
                    alert(error.response?.data?.message || 'Помилка при видаленні користувача');
                });
        }
    };

    const updatePermissionsState = (memberId, updatedPermissions) => {
        setPermissionsState(prev => ({
            ...prev,
            [memberId]: updatedPermissions,
        }));
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

            <span className={styles.executorCount}>
                Виконавці: {executorCount}
            </span>
            {canAddTasks && (
                <button onClick={() => setModalTaskVisible(true)} className={styles.iconButton} aria-label="Створити задачу">
                    <FaPlus />
                    <span className={styles.tooltip}>Створити задачу</span>
                </button>
            )}
            <MyModal visible={modalTaskVisible} setVisible={setModalTaskVisible}>
                <AddTaskForm id={group._id} setVisible={setModalTaskVisible} />
            </MyModal>
            {isOwner && (
                <>
                    <button onClick={() => removeGroup(group)} className={styles.iconButton} aria-label="Видалити групу">
                        <FaTrash />
                        <span className={styles.tooltip}>Видалити групу</span>
                    </button>
                    <InviteUserForm groupId={groupId} />
                </>
            )}
            {!editGroup && isOwner && (
                <button onClick={() => setEditGroup(true)} className={styles.iconButton} aria-label="Редагувати групу">
                    <FaPencilAlt />
                    <span className={styles.tooltip}>Редагувати групу</span>
                </button>
            )}
            <button onClick={() => checkCompleted(group)} className={`${styles.iconButton} ${styles.statsButton}`} aria-label="Статистика групи">
                <FaChartBar />
                <span className={styles.tooltip}>Статистика групи</span>
            </button>
            {Array.isArray(members) && members.length > 0 && (
                <div className={styles.membersList}>
                    <h3>Учасники:</h3>
                    <ul>
                        {members.map((member) => (
                            member && member._id ? (
                                <li key={member._id} className={styles.memberItem}>
                                    <span>{member.fullName} ({member.email})</span>
                                    {isOwner && member._id.toString() !== authData?._id && (
                                        <div>
                                            <button
                                                onClick={() => handleRemoveUser(member._id)}
                                                className={styles.iconButton}
                                                aria-label="Видалити"
                                            >
                                                <FaTrash />
                                                <span className={styles.tooltip}>Видалити</span>
                                            </button>
                                            <EditPermissionsForm
                                                groupId={groupId}
                                                memberId={member._id}
                                                initialPermissions={permissionsState[member._id] || {
                                                    canAddTasks: false,
                                                    canEditTasks: false,
                                                    canDeleteTasks: false,
                                                }}
                                                updatePermissionsState={updatePermissionsState}
                                            />
                                        </div>
                                    )}
                                </li>
                            ) : null
                        ))}
                    </ul>
                </div>
            )}
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
                            canEditTasks={canEditTasks}
                            canDeleteTasks={canDeleteTasks}
                        />
                    ))}
                </div>
                : <h1 className={styles.groupHeader}>Список задач порожній</h1>
            }
        </div>
    );
};

export default Group;