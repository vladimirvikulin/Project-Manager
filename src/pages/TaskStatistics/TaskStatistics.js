import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Link } from "react-router-dom";
import styles from './TaskStatistics.module.css'
import MyButton from '../../components/ui/button/MyButton';
import PropTypes from 'prop-types';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const TaskStatistics = ({statistics}) => {
  const dataForCompleted = {
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
  const optionsForCompleted = {
    plugins: {
      title: {
        display: true,
        text: 'Статистика виконання',
      },
    },
  };
  const dataForPriority = {
    labels: statistics.topPriorityGroups?.map((item) => item.group),
    title: 'fsasdads',
    datasets: [
      {
        label: '# Завдань',
        data: statistics.topPriorityGroups?.map((item) => item.count),
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
      },
    },
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
      <Pie options={optionsForCompleted} data={dataForCompleted}/>;
      {statistics.hasOwnProperty('topPriorityGroups') ? <Pie options={optionsForPriority} data={dataForPriority}/> : <></>}
    </div>
  </div>
  )
}

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