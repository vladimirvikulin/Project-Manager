import React, { useState } from 'react';
import { optimizeGantt, optimizeSchedule } from '../../utils/ganttUtils';
import styles from '../../pages/TaskNetwork/TaskNetwork.module.css';
import MyButton from '../ui/button/MyButton';

const GanttChart = ({ ganttData, groups }) => {
    const [useOptimizedSchedule, setUseOptimizedSchedule] = useState(false);
    const DAY_WIDTH = 30;

    const groupedTasks = ganttData.reduce((acc, task) => {
        const groupId = task.groupId;
        if (!acc[groupId]) {
            acc[groupId] = [];
        }
        acc[groupId].push(task);
        return acc;
    }, {});

    const handleOptimizeSchedule = () => {
        setUseOptimizedSchedule(true);
    };

    const handleResetOptimization = () => {
        setUseOptimizedSchedule(false);
    };

    return (
        <div className={styles.ganttContainer}>
            <div className={styles.buttonWrapper}>
                <MyButton onClick={handleOptimizeSchedule}>
                    Оптимізація розкладу
                </MyButton>
                <MyButton onClick={handleResetOptimization}>
                    Скасувати оптимізацію
                </MyButton>
            </div>

            {Object.keys(groupedTasks).map(groupId => {
                const groupTasks = groupedTasks[groupId];
                const group = groups.find(g => g._id === groupId);
                const groupTitle = group ? group.title : 'Невідома група';
                const numExecutors = group ? (group.executorCount || 2) : 2;

                const ganttExecutors = useOptimizedSchedule
                    ? optimizeSchedule(groupTasks)
                    : optimizeGantt(groupTasks, numExecutors);

                const minStartDate = new Date(Math.min(...groupTasks.map(task => task.earliestStartDate)));
                const maxFinishDate = new Date(Math.max(...groupTasks.map(task => task.latestFinishDate)));

                const totalDays = Math.ceil((maxFinishDate - minStartDate) / (1000 * 60 * 60 * 24));

                const timelineDates = [];
                for (let i = 0; i < totalDays; i++) {
                    const date = new Date(minStartDate);
                    date.setDate(minStartDate.getDate() + i);
                    timelineDates.push(date);
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
                                const sortedTasks = [...executor].sort((a, b) => new Date(a.earliestStartDate) - new Date(b.earliestStartDate));
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
                                            Виконавець {executorIndex + 1}
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
                                                        className={styles.ganttTask}
                                                        style={{
                                                            left: `${startDay * DAY_WIDTH}px`,
                                                            width: `${taskWidth}px`,
                                                            background: task.deadlineMissed ? '#ff9999' : '#90ee90',
                                                            height: '40px',
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
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default GanttChart;