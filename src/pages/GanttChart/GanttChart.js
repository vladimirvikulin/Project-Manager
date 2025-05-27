import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups, selectGroups } from '../../redux/slices/groups';
import { selectIsAuth } from '../../redux/slices/auth';
import { Navigate, Link } from 'react-router-dom';
import MyButton from '../../components/ui/button/MyButton';
import styles from './GanttChart.module.css';
import { sortTasksWithDependencies, optimizeSchedule, calculateTimings, calculateTaskLevel } from '../../utils/ganttUtils';

const GanttChart = () => {
    const dispatch = useDispatch();
    const { groups } = useSelector(selectGroups);
    const isAuth = useSelector(selectIsAuth);
    const isGroupsLoading = groups.status === 'loading';

    const [useOptimizedSchedule, setUseOptimizedSchedule] = useState(false);
    const DAY_WIDTH = 40;

    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);

    const ganttData = groups.items.flatMap(group =>
        group.tasks.map(task => ({
            ...task,
            groupId: group._id,
            members: group.members,
            earliestStartDate: new Date(task.earliestStartDate || task.createdAt),
            earliestFinishDate: new Date(task.earliestFinishDate || task.deadline || task.createdAt),
            latestFinishDate: new Date(task.deadline || task.earliestFinishDate || task.createdAt),
            deadlineMissed: task.deadline && new Date(task.deadline) < new Date(),
            assignedTo: task.assignedTo || null,
            duration: task.duration || Math.ceil((new Date(task.earliestFinishDate) - new Date(task.earliestStartDate)) / (1000 * 60 * 60 * 24)),
            dependencies: task.dependencies || [],
        }))
    );

    const handleToggleOptimization = () => {
        setUseOptimizedSchedule(prev => !prev);
    };

    const groupedTasks = ganttData.reduce((acc, task) => {
        const groupId = task.groupId;
        if (!acc[groupId]) {
            acc[groupId] = {
                tasks: [],
                members: task.members || [],
            };
        }
        acc[groupId].tasks.push(task);
        return acc;
    }, {});

    if (!isAuth) {
        return <Navigate to="/login" />;
    }

    if (isGroupsLoading) {
        return <div>Завантаження...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.buttonWrapper}>
                <div className={styles.buttonGroupLeft}>
                    <Link to="/" className={styles.backLink}>
                        <MyButton>Назад</MyButton>
                    </Link>
                </div>
            </div>
            <h1 className={styles.title}>Діаграма Ганта</h1>
            <div className={styles.optimizationButtonWrapper}>
                <MyButton
                    onClick={handleToggleOptimization}
                    className={useOptimizedSchedule ? styles.activeButton : ''}
                >
                    {useOptimizedSchedule ? 'Скасувати оптимізацію' : 'Оптимізувати розклад'}
                </MyButton>
            </div>
            <div className={styles.ganttContainer}>
                {Object.keys(groupedTasks).map(groupId => {
                    const { tasks: groupTasks, members } = groupedTasks[groupId];
                    const group = groups.items.find(g => g._id === groupId);
                    const groupTitle = group ? group.title : 'Невідомий проєкт';
                    const groupCreatedAt = group?.createdAt || new Date();

                    const adjustedTasks = calculateTimings(groupTasks, groupCreatedAt);
                    const minStartDate = new Date(Math.min(...adjustedTasks.map(task => task.earliestStartDate)));
                    const maxFinishDate = new Date(Math.max(...adjustedTasks.map(task => {
                        const start = new Date(task.earliestStartDate);
                        const durationDays = task.duration || Math.ceil((new Date(task.earliestFinishDate) - start) / (1000 * 60 * 60 * 24));
                        return new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000);
                    })));
                    const totalDays = Math.max(10, Math.ceil((maxFinishDate - minStartDate) / (1000 * 60 * 60 * 24)));
                    const totalWidth = totalDays * DAY_WIDTH + 200;

                    const timelineDates = [];
                    for (let i = 0; i < totalDays; i++) {
                        const date = new Date(minStartDate);
                        date.setDate(minStartDate.getDate() + i);
                        timelineDates.push(date);
                    }

                    let ganttExecutors = [];
                    let unassignedTasks = [];

                    if (useOptimizedSchedule) {
                        ganttExecutors = optimizeSchedule(adjustedTasks, members, groupCreatedAt);
                        const assignedTaskIds = new Set(ganttExecutors.flatMap(exec => exec.tasks.map(task => task._id)));
                        unassignedTasks = adjustedTasks.filter(task => !assignedTaskIds.has(task._id));
                    } else {
                        const assignedTasks = new Set();
                        const executorTasks = members.map(member => {
                            const memberTasks = adjustedTasks.filter(task => task.assignedTo === member._id && !assignedTasks.has(task._id));
                            memberTasks.forEach(task => assignedTasks.add(task._id));
                            const sortedTasks = [...memberTasks].sort((a, b) => new Date(a.earliestStartDate) - new Date(b.earliestStartDate));
                            const taskOffsets = new Map();
                            const occupiedIntervals = [];

                            sortedTasks.forEach((task, index) => {
                                const startDay = Math.floor((new Date(task.earliestStartDate) - minStartDate) / (1000 * 60 * 60 * 24));
                                const taskDays = task.duration || Math.ceil((new Date(task.earliestFinishDate) - new Date(task.earliestStartDate)) / (1000 * 60 * 60 * 24));
                                const endDay = startDay + taskDays;

                                const level = calculateTaskLevel(occupiedIntervals, startDay, endDay);

                                taskOffsets.set(task._id, level * 50);
                                occupiedIntervals.push({ startDay, endDay, level });
                            });

                            const maxLevel = Math.max(...Array.from(taskOffsets.values()).map(offset => offset / 50), 0);
                            return {
                                member,
                                tasks: sortedTasks.map(task => ({
                                    ...task,
                                    offsetY: taskOffsets.get(task._id) || 0,
                                })),
                                maxLevel,
                            };
                        }).filter(executor => executor.tasks.length > 0);

                        ganttExecutors = executorTasks;
                        unassignedTasks = adjustedTasks.filter(task => !task.assignedTo || !members.some(member => member._id === task.assignedTo));
                    }

                    return (
                        <div key={groupId} className={styles.groupSection}>
                            <h2 className={styles.groupTitle}>{groupTitle}</h2>
                            <div className={styles.scrollableSection}>
                                <div className={styles.ganttWrapper}>
                                    <div
                                        className={styles.ganttTimelineWrapper}
                                        style={{ width: `${totalWidth}px` }}
                                    >
                                        <div className={styles.ganttTimelineSpacer} />
                                        <div className={styles.ganttTimeline}>
                                            {timelineDates.map((date, index) => (
                                                <div
                                                    key={index}
                                                    className={styles.ganttTimelineCell}
                                                    style={{ width: `${DAY_WIDTH}px` }}
                                                >
                                                    {date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' })}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div
                                        className={styles.ganttBody}
                                        style={{ width: `${totalWidth}px` }}
                                    >
                                        {ganttExecutors.map((executor, executorIndex) => (
                                            <div
                                                key={executorIndex}
                                                className={styles.ganttRow}
                                                style={{ height: `${(executor.maxLevel + 1) * 50 + 10}px`, minHeight: '60px' }}
                                            >
                                                <div className={styles.ganttExecutorLabel}>
                                                    {useOptimizedSchedule
                                                        ? `Виконавець ${executorIndex + 1}`
                                                        : (executor.member?.fullName || executor.member?.email || `Виконавець ${executorIndex + 1}`)}
                                                </div>
                                                <div
                                                    className={styles.ganttRowContent}
                                                    style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: `repeat(${totalDays}, ${DAY_WIDTH}px)`,
                                                        width: `${totalDays * DAY_WIDTH}px`,
                                                    }}
                                                >
                                                    {executor.tasks.map(task => {
                                                        const startDay = Math.floor((new Date(task.earliestStartDate) - minStartDate) / (1000 * 60 * 60 * 24));
                                                        const taskDays = task.duration || Math.ceil((new Date(task.earliestFinishDate) - new Date(task.earliestStartDate)) / (1000 * 60 * 60 * 24));
                                                        const calculatedWidth = taskDays * DAY_WIDTH;
                                                        const taskWidth = Math.max(calculatedWidth, 30);
                                                        return (
                                                            <div
                                                                key={task._id}
                                                                className={`${styles.ganttTask} ${task.deadlineMissed ? styles.ganttTaskMissed : styles.ganttTaskNormal}`}
                                                                style={{
                                                                    gridColumn: `${startDay + 1} / span ${taskDays}`,
                                                                    gridRow: `${(task.offsetY || 0) / 50 + 1}`,
                                                                    width: `${taskWidth}px`,
                                                                }}
                                                            >
                                                                <div className={styles.ganttTaskContent} title={task.title}>
                                                                    <strong>{task.title}</strong>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}

                                        {unassignedTasks.length > 0 && (
                                            <div
                                                className={styles.ganttRow}
                                                style={{ height: '150px', minHeight: '60px' }}
                                            >
                                                <div className={styles.ganttExecutorLabel}>
                                                    Непризначені задачі
                                                </div>
                                                <div
                                                    className={styles.ganttRowContent}
                                                    style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: `repeat(${totalDays}, ${DAY_WIDTH}px)`,
                                                        width: `${totalDays * DAY_WIDTH}px`,
                                                    }}
                                                >
                                                    {(() => {
                                                        const sortedUnassignedTasks = sortTasksWithDependencies(unassignedTasks);
                                                        const taskOffsets = new Map();
                                                        const occupiedIntervals = [];

                                                        sortedUnassignedTasks.forEach((task, index) => {
                                                            const startDay = Math.floor((new Date(task.earliestStartDate) - minStartDate) / (1000 * 60 * 60 * 24));
                                                            const taskDays = task.duration || Math.ceil((new Date(task.earliestFinishDate) - new Date(task.earliestStartDate)) / (1000 * 60 * 60 * 24));
                                                            const endDay = startDay + taskDays;

                                                            const level = calculateTaskLevel(occupiedIntervals, startDay, endDay);

                                                            taskOffsets.set(task._id, level * 50);
                                                            occupiedIntervals.push({ startDay, endDay, level });
                                                        });

                                                        return sortedUnassignedTasks.map(task => {
                                                            const startDay = Math.floor((new Date(task.earliestStartDate) - minStartDate) / (1000 * 60 * 60 * 24));
                                                            const taskDays = task.duration || Math.ceil((new Date(task.earliestFinishDate) - new Date(task.earliestStartDate)) / (1000 * 60 * 60 * 24));
                                                            const calculatedWidth = taskDays * DAY_WIDTH;
                                                            const taskWidth = Math.max(calculatedWidth, 30);
                                                            const offsetY = taskOffsets.get(task._id) || 0;
                                                            return (
                                                                <div
                                                                    key={task._id}
                                                                    className={`${styles.ganttTask} ${task.deadlineMissed ? styles.ganttTaskMissed : styles.ganttTaskNormal}`}
                                                                    style={{
                                                                        gridColumn: `${startDay + 1} / span ${taskDays}`,
                                                                        gridRow: `${offsetY / 50 + 1}`,
                                                                        width: `${taskWidth}px`,
                                                                    }}
                                                                >
                                                                    <div className={styles.ganttTaskContent} title={task.title}>
                                                                        <strong>{task.title}</strong>
                                                                    </div>
                                                                </div>
                                                            );
                                                        });
                                                    })()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GanttChart;