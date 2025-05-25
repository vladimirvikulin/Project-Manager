import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups, selectGroups } from '../../redux/slices/groups';
import { selectIsAuth } from '../../redux/slices/auth';
import { Navigate, Link } from 'react-router-dom';
import MyButton from '../../components/ui/button/MyButton';
import styles from './GanttChart.module.css';
import { optimizeSchedule } from '../../utils/ganttUtils';

const GanttChart = () => {
    const dispatch = useDispatch();
    const { groups } = useSelector(selectGroups);
    const isAuth = useSelector(selectIsAuth);
    const isGroupsLoading = groups.status === 'loading';

    const [useOptimizedSchedule, setUseOptimizedSchedule] = useState(false);
    const DAY_WIDTH = 30;

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

                    const minStartDate = new Date(Math.min(...groupTasks.map(task => task.earliestStartDate)));
                    const maxFinishDate = new Date(Math.max(...groupTasks.map(task => task.latestFinishDate)));
                    const totalDays = Math.ceil((maxFinishDate - minStartDate) / (1000 * 60 * 60 * 24));

                    const timelineDates = [];
                    for (let i = 0; i < totalDays; i++) {
                        const date = new Date(minStartDate);
                        date.setDate(minStartDate.getDate() + i);
                        timelineDates.push(date);
                    }

                    let ganttExecutors = [];
                    let unassignedTasks = [];

                    if (useOptimizedSchedule) {
                        ganttExecutors = optimizeSchedule(groupTasks, members);
                    } else {
                        const executorTasks = members.map(member => ({
                            member,
                            tasks: groupTasks.filter(task => task.assignedTo === member._id),
                        }));
                        ganttExecutors = executorTasks;
                        unassignedTasks = groupTasks.filter(task => !task.assignedTo);
                    }

                    return (
                        <div key={groupId} className={styles.groupSection}>
                            <h2 className={styles.groupTitle}>{groupTitle}</h2>
                            <div className={styles.ganttTimelineWrapper}>
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

                            <div className={styles.ganttBody}>
                                {ganttExecutors.map((executor, executorIndex) => {
                                    const member = useOptimizedSchedule ? null : executor.member;
                                    const tasks = useOptimizedSchedule ? executor : executor.tasks;
                                    const sortedTasks = [...tasks].sort((a, b) => new Date(a.earliestStartDate) - new Date(b.earliestStartDate));
                                    const taskOffsets = new Map();
                                    const occupiedIntervals = [];

                                    sortedTasks.forEach((task, index) => {
                                        const startDay = Math.floor((task.earliestStartDate - minStartDate) / (1000 * 60 * 60 * 24));
                                        const taskDays = Math.ceil((task.earliestFinishDate - task.earliestStartDate) / (1000 * 60 * 60 * 24));
                                        const endDay = startDay + taskDays;

                                        const checkOverlaps = (level) => {
                                            return occupiedIntervals.some(interval => {
                                                if (interval.level !== level) return false;
                                                return !(
                                                    (interval.endDay <= startDay) ||
                                                    (endDay <= interval.startDay)
                                                );
                                            });
                                        };

                                        let level = 0;
                                        while (true) {
                                            const overlaps = checkOverlaps(level);
                                            if (!overlaps) break;
                                            level++;
                                        }

                                        taskOffsets.set(task._id, level * 50);
                                        occupiedIntervals.push({ startDay, endDay, level });
                                    });

                                    return (
                                        <div key={executorIndex} className={styles.ganttRow}>
                                            <div className={styles.ganttExecutorLabel}>
                                                {member
                                                    ? (member.fullName || member.email)
                                                    : `Виконавець ${executorIndex + 1}`}
                                            </div>
                                            <div className={styles.ganttRowContent}>
                                                {timelineDates.map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className={styles.ganttGridLine}
                                                        style={{
                                                            left: `${index * DAY_WIDTH}px`,
                                                            width: `${DAY_WIDTH}px`,
                                                        }}
                                                    />
                                                ))}
                                                {sortedTasks.map(task => {
                                                    const startDay = Math.floor((task.earliestStartDate - minStartDate) / (1000 * 60 * 60 * 24));
                                                    const taskDays = Math.ceil((task.earliestFinishDate - task.earliestStartDate) / (1000 * 60 * 60 * 24));
                                                    const calculatedWidth = taskDays * DAY_WIDTH;
                                                    const taskWidth = Math.max(calculatedWidth, 30);
                                                    const offsetY = taskOffsets.get(task._id);
                                                    return (
                                                        <div
                                                            key={task._id}
                                                            className={`${styles.ganttTask} ${task.deadlineMissed ? styles.ganttTaskMissed : styles.ganttTaskNormal}`}
                                                            style={{
                                                                left: `${startDay * DAY_WIDTH}px`,
                                                                width: `${taskWidth}px`,
                                                                top: `${10 + offsetY}px`,
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
                                    );
                                })}

                                {!useOptimizedSchedule && unassignedTasks.length > 0 && (
                                    <div className={styles.ganttRow}>
                                        <div className={styles.ganttExecutorLabel}>
                                            Непризначені задачі
                                        </div>
                                        <div className={styles.ganttRowContent}>
                                            {timelineDates.map((_, index) => (
                                                <div
                                                    key={index}
                                                    className={styles.ganttGridLine}
                                                    style={{
                                                        left: `${index * DAY_WIDTH}px`,
                                                        width: `${DAY_WIDTH}px`,
                                                    }}
                                                />
                                            ))}
                                            {(() => {
                                                const sortedUnassignedTasks = [...unassignedTasks].sort((a, b) => new Date(a.earliestStartDate) - new Date(b.earliestStartDate));
                                                const taskOffsets = new Map();
                                                const occupiedIntervals = [];

                                                sortedUnassignedTasks.forEach((task, index) => {
                                                    const startDay = Math.floor((task.earliestStartDate - minStartDate) / (1000 * 60 * 60 * 24));
                                                    const taskDays = Math.ceil((task.earliestFinishDate - task.earliestStartDate) / (1000 * 60 * 60 * 24));
                                                    const endDay = startDay + taskDays;

                                                    const checkOverlaps = (level) => {
                                                        return occupiedIntervals.some(interval => {
                                                            if (interval.level !== level) return false;
                                                            return !(
                                                                (interval.endDay <= startDay) ||
                                                                (endDay <= interval.startDay)
                                                            );
                                                        });
                                                    };

                                                    let level = 0;
                                                    while (true) {
                                                        const overlaps = checkOverlaps(level);
                                                        if (!overlaps) break;
                                                        level++;
                                                    }

                                                    taskOffsets.set(task._id, level * 50);
                                                    occupiedIntervals.push({ startDay, endDay, level });
                                                });

                                                return sortedUnassignedTasks.map(task => {
                                                    const startDay = Math.floor((task.earliestStartDate - minStartDate) / (1000 * 60 * 60 * 24));
                                                    const taskDays = Math.ceil((task.earliestFinishDate - task.earliestStartDate) / (1000 * 60 * 60 * 24));
                                                    const calculatedWidth = taskDays * DAY_WIDTH;
                                                    const taskWidth = Math.max(calculatedWidth, 30);
                                                    const offsetY = taskOffsets.get(task._id);
                                                    return (
                                                        <div
                                                            key={task._id}
                                                            className={`${styles.ganttTask} ${task.deadlineMissed ? styles.ganttTaskMissed : styles.ganttTaskNormal}`}
                                                            style={{
                                                                left: `${startDay * DAY_WIDTH}px`,
                                                                width: `${taskWidth}px`,
                                                                top: `${10 + offsetY}px`,
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
                    );
                })}
            </div>
        </div>
    );
};

export default GanttChart;