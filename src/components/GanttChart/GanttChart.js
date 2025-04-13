import React from 'react';
import { optimizeGantt } from '../../utils/ganttUtils';
import styles from '../../pages/TaskNetwork/TaskNetwork.module.css';

const GanttChart = ({ ganttData }) => {
    const ganttExecutors = optimizeGantt(ganttData);
    const DAY_WIDTH = 30;

    const minStartDate = new Date(Math.min(...ganttData.map(task => task.earliestStartDate)));
    const maxFinishDate = new Date(Math.max(...ganttData.map(task => task.latestFinishDate)));

    const totalDays = Math.ceil((maxFinishDate - minStartDate) / (1000 * 60 * 60 * 24));

    const timelineDates = [];
    for (let i = 0; i < totalDays; i++) {
        const date = new Date(minStartDate);
        date.setDate(minStartDate.getDate() + i);
        timelineDates.push(date);
    }

    return (
        <div className={styles.ganttContainer}>
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
                {ganttExecutors.map((executor, executorIndex) => (
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
                            {executor.map(task => {
                                const startDay = Math.floor((task.earliestStartDate - minStartDate) / (1000 * 60 * 60 * 24));
                                const taskDays = Math.ceil((task.earliestFinishDate - task.earliestStartDate) / (1000 * 60 * 60 * 24));
                                const calculatedWidth = taskDays * DAY_WIDTH;
                                const taskWidth = Math.max(calculatedWidth, 30);
                                return (
                                    <div
                                        key={task._id}
                                        className={styles.ganttTask}
                                        style={{
                                            left: `${startDay * DAY_WIDTH}px`,
                                            width: `${taskWidth}px`,
                                            background: task.deadlineMissed ? '#ff9999' : '#90ee90',
                                            height: '40px',
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
            </div>
        </div>
    );
};

export default GanttChart;