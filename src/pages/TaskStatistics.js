import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Link } from "react-router-dom";
import '../styles/App.css'

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskStatistics = ({completedTask, notCompletedTask, loadGroupsFromLocal}) => {
  const data = {
    labels: ['Виконані', 'Невиконані'],
    datasets: [
      {
        label: '# Завдань',
        data: [completedTask, notCompletedTask] ,
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
    <div className='link'>
      <Link onClick={loadGroupsFromLocal} to='/'>Список</Link>
    </div>
    <Pie data={data}/>;
  </div>
  )
}

export default TaskStatistics;