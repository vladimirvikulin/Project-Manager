import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Link } from "react-router-dom";
import '../styles/App.css';
import MyButton from '../components/ui/button/MyButton';

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskStatistics = ({statistics}) => {
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
  <div className='pieChart'>
    <MyButton>
      <Link to='/'>Список</Link>
    </MyButton>
    <Pie data={data}/>;
  </div>
  )
}

export default TaskStatistics;