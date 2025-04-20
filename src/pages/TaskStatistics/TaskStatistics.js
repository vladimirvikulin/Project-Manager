import React, { useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups, selectGroups } from '../../redux/slices/groups';
import styles from './TaskStatistics.module.css';
import MyButton from '../../components/ui/button/MyButton';
import PropTypes from 'prop-types';

ChartJS.register(ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale, LineElement, PointElement);

const TaskStatistics = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { groups } = useSelector(selectGroups);
    const isGroupsLoading = groups.status === 'loading';
    let statistics = location.state?.statistics;

    useEffect(() => {
      dispatch(fetchGroups());
    }, [dispatch]);

    if (!statistics && !isGroupsLoading) {
        let completed = 0;
        let notCompleted = 0;
        const priorityCounts = [];
        const taskDurations = [];
        const missedDeadlines = [];
        const dependencyStats = { withDependencies: 0, withoutDependencies: 0 };

        groups.items.forEach((group) => {
            const { title, tasks } = group;

            const priorityCount = tasks.reduce(
                (count, task) => count + (task.priority ? 1 : 0),
                0
            );
            priorityCounts.push({ group: title, count: priorityCount });

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
                        const groupMissed = missedDeadlines.find(md => md.group === title);
                        if (groupMissed) {
                            groupMissed.count += 1;
                        } else {
                            missedDeadlines.push({ group: title, count: 1 });
                        }
                    }
                }

                if (task.dependencies && task.dependencies.length > 0) {
                    dependencyStats.withDependencies += 1;
                } else {
                    dependencyStats.withoutDependencies += 1;
                }
            });
        });

        priorityCounts.sort((a, b) => b.count - a.count);
        const topPriorityGroups = priorityCounts.slice(0, 6);

        taskDurations.sort((a, b) => a.duration - b.duration);

        statistics = {
            topPriorityGroups,
            completed,
            notCompleted,
            taskDurations,
            missedDeadlines,
            dependencyStats,
            groups: groups.items.map(group => ({
                group: group.title,
                count: group.tasks.length,
            })),
            type: 'general',
        };
    }

    if (isGroupsLoading) {
        return (
            <div className={styles.container}>
                <Link className={styles.link} to="/">
                    <MyButton>Список</MyButton>
                </Link>
                <div className={styles.title}>Завантаження...</div>
            </div>
        );
    }

    if (!statistics || groups.status === 'error') {
        return (
            <div className={styles.container}>
                <Link className={styles.link} to="/">
                    <MyButton>Список</MyButton>
                </Link>
                <div className={styles.title}>Не вдалося завантажити статистику. Спробуйте ще раз.</div>
            </div>
        );
    }

    if (!groups.items.length) {
        return (
            <div className={styles.container}>
                <Link className={styles.link} to="/">
                    <MyButton>Список</MyButton>
                </Link>
                <h1 className={styles.title}>Немає груп для відображення статистики.</h1>
            </div>
        );
    }

    const isGroupStatistics = statistics.type === 'group';
    console.log("isGroupStatistics", isGroupStatistics)
    console.log("statistics.type", statistics.type)

    const dataForCompleted = {
        labels: ['Виконані', 'Невиконані'],
        datasets: [
            {
                label: '# Завдань',
                data: [statistics.completed, statistics.notCompleted],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const optionsForCompleted = {
        plugins: {
            title: {
                display: true,
                text: 'Статистика виконання',
                font: { size: 16 },
            },
            legend: { position: 'bottom' },
        },
        maintainAspectRatio: false,
    };

    const dataForPriority = {
        labels: statistics.topPriorityGroups?.map((item) => item.group) || [],
        datasets: [
            {
                label: '# Пріоритетних завдань',
                data: statistics.topPriorityGroups?.map((item) => item.count) || [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const optionsForPriority = {
        plugins: {
            title: {
                display: true,
                text: 'Найважливіші групи',
                font: { size: 16 },
            },
            legend: { position: 'bottom' },
        },
        maintainAspectRatio: false,
    };

    const dataForGroups = {
        labels: statistics.groups?.map((group) => group.group) || [],
        datasets: [
            {
                label: 'Кількість завдань',
                data: statistics.groups?.map((group) => group.count) || [],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const optionsForGroups = {
        plugins: {
            title: {
                display: true,
                text: 'Завдання по групах',
                font: { size: 16 },
            },
            legend: { position: 'bottom' },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Кількість завдань' },
            },
            x: {
                title: { display: true, text: 'Групи' },
            },
        },
        maintainAspectRatio: false,
    };

    const dataForDurations = {
        labels: statistics.taskDurations?.map(item => `${item.duration} дн.`),
        datasets: [
            {
                label: 'Кількість задач',
                data: statistics.taskDurations?.map(item => item.count) || [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const optionsForDurations = {
        plugins: {
            title: {
                display: true,
                text: 'Розподіл тривалості задач',
                font: { size: 16 },
            },
            legend: { position: 'bottom' },
        },
        scales: {
            x: {
                title: { display: true, text: 'Тривалість (дні)' },
            },
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Кількість задач' },
            },
        },
        maintainAspectRatio: false,
    };

    const dataForMissedDeadlines = {
        labels: statistics.missedDeadlines?.map(item => item.group) || [],
        datasets: [
            {
                label: 'Прострочені дедлайни',
                data: statistics.missedDeadlines?.map(item => item.count) || [],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const optionsForMissedDeadlines = {
        plugins: {
            title: {
                display: true,
                text: isGroupStatistics ? 'Прострочені дедлайни' : 'Прострочені дедлайни по групах',
                font: { size: 16 },
            },
            legend: { position: 'bottom' },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Кількість прострочених' },
            },
            x: {
                title: { display: true, text: isGroupStatistics ? 'Група' : 'Групи' },
            },
        },
        maintainAspectRatio: false,
    };

    const dataForDependencies = {
        labels: ['З залежностями', 'Без залежностей'],
        datasets: [
            {
                label: '# Завдань',
                data: [
                    statistics.dependencyStats?.withDependencies || 0,
                    statistics.dependencyStats?.withoutDependencies || 0,
                ],
                backgroundColor: ['rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
                borderColor: ['rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const optionsForDependencies = {
        plugins: {
            title: {
                display: true,
                text: 'Розподіл залежностей',
                font: { size: 16 },
            },
            legend: { position: 'bottom' },
        },
        maintainAspectRatio: false,
    };

    return (
        <div className={styles.container}>
            <Link className={styles.link} to="/">
                <MyButton>Список</MyButton>
            </Link>

            <div className={styles.title}>
                {isGroupStatistics ? `Статистика групи "${statistics.title}"` : 'Загальна статистика'}
            </div>

            <div className={styles.textStats}>
                <div className={styles.statCard}>
                    <h3>Виконані: {statistics.completed}</h3>
                    <h3>Невиконані: {statistics.notCompleted}</h3>
                    <h3>Всього: {statistics.completed + statistics.notCompleted}</h3>
                </div>
            </div>

            <div className={styles.charts}>
                <div className={styles.chartWrapper}>
                    <Pie options={optionsForCompleted} data={dataForCompleted} />
                </div>

                {!isGroupStatistics && statistics.hasOwnProperty('topPriorityGroups') && (
                    <div className={styles.chartWrapper}>
                        <Pie options={optionsForPriority} data={dataForPriority} />
                    </div>
                )}

                {!isGroupStatistics && statistics.hasOwnProperty('groups') && (
                    <div className={styles.chartWrapper}>
                        <Bar options={optionsForGroups} data={dataForGroups} />
                    </div>
                )}

                {statistics.hasOwnProperty('taskDurations') && (
                    <div className={styles.chartWrapper}>
                        <Bar options={optionsForDurations} data={dataForDurations} />
                    </div>
                )}

                {statistics.hasOwnProperty('missedDeadlines') && (
                    <div className={styles.chartWrapper}>
                        <Bar options={optionsForMissedDeadlines} data={dataForMissedDeadlines} />
                    </div>
                )}

                {statistics.hasOwnProperty('dependencyStats') && (
                    <div className={styles.chartWrapper}>
                        <Pie options={optionsForDependencies} data={dataForDependencies} />
                    </div>
                )}
            </div>
        </div>
    );
};

TaskStatistics.propTypes = {
  statistics: PropTypes.shape({
      completed: PropTypes.number.isRequired,
      notCompleted: PropTypes.number.isRequired,
      topPriorityGroups: PropTypes.arrayOf(PropTypes.shape({
          group: PropTypes.string.isRequired,
          count: PropTypes.number.isRequired,
      })),
      title: PropTypes.string,
  }).isRequired,
};

export default TaskStatistics;