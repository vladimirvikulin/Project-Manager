import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Link } from "react-router-dom";
import styles from './TaskStatistics.module.css'
import MyButton from '../../components/ui/button/MyButton';

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskStatistics = ({statistics}) => {
  console.log(statistics)
  console.log(statistics.hasOwnProperty('title'))
  const data = {
    labels: ['Виконані', 'Невиконані'],
    datasets: [
      {
        label: '# Завдань',
        data: [statistics.completed, statistics.notCompleted],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
  <div>
    <Link className = {styles.link} to='/'>
      <MyButton>
        Список
      </MyButton>
    </Link>
    <div className={styles.title}>{statistics.hasOwnProperty('title') ? `Статистика ${statistics.title}` : 'Загальна статистика'}</div>
    <div className={styles.pieChart}>
      <Pie data={data}/>;
    </div>
  </div>
  )
}

export default TaskStatistics;