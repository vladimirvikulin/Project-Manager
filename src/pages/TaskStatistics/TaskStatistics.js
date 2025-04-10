import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import styles from './TaskStatistics.module.css';
import MyButton from '../../components/ui/button/MyButton';

ChartJS.register(ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale, LineElement, PointElement);

const TaskStatistics = ({ statistics }) => {
  const [chartType, setChartType] = useState('pie');

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

  const renderCompletedChart = () => {
    if (chartType === 'pie') {
      return <Pie options={optionsForCompleted} data={dataForCompleted} />;
    } else if (chartType === 'bar') {
      return <Bar options={optionsForCompleted} data={dataForCompleted} />;
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <Link className={styles.link} to="/">
        <MyButton>Список</MyButton>
      </Link>

      <div className={styles.title}>
        {statistics.hasOwnProperty('title') ? `Статистика ${statistics.title}` : 'Загальна статистика'}
      </div>

      <div className={styles.textStats}>
        <div className={styles.statCard}>
          <h3>Виконані: {statistics.completed}</h3>
          <h3>Невиконані: {statistics.notCompleted}</h3>
          <h3>Всього: {statistics.completed + statistics.notCompleted}</h3>
        </div>
      </div>

      <div className={styles.chartToggle}>
        <MyButton onClick={() => setChartType('pie')}>Кругова</MyButton>
        <MyButton onClick={() => setChartType('bar')}>Стовпчикова</MyButton>
      </div>

      <div className={styles.charts}>
        <div className={styles.chartWrapper}>
          {renderCompletedChart()}
        </div>

        {statistics.hasOwnProperty('topPriorityGroups') && (
          <div className={styles.chartWrapper}>
            <Pie options={optionsForPriority} data={dataForPriority} />
          </div>
        )}

        {statistics.hasOwnProperty('groups') && (
          <div className={styles.chartWrapper}>
            <Bar options={optionsForGroups} data={dataForGroups} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskStatistics;