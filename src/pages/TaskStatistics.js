import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Link } from "react-router-dom";
import '../styles/App.css'

ChartJS.register(ArcElement, Tooltip, Legend);
let dataStatisctics = []
const data = {
  labels: ['Виконані', 'Невиконані'],
  datasets: [
    {
      label: '# Завдань',
      data: dataStatisctics,
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

const TaskStatistics = ({completedTask, notCompletedTask}) => {
  dataStatisctics = [completedTask, notCompletedTask] 
  return (
  <div className='pieChart'>
    <div className='link'>
      <Link to='/'>Список</Link>
    </div>
    <Pie data={data}/>;
  </div>
  )
}

export default TaskStatistics;