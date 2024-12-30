'use client'

import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const Dashboard = () => {
  const data = {
    labels: ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Other'],
    datasets: [
      {
        data: [300, 150, 100, 200, 50],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Expense Overview</h3>
        <div className="w-64 h-64 mx-auto">
          <Doughnut data={data} />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Recent Transactions</h3>
        <ul>
          <li className="mb-2">Groceries - $50</li>
          <li className="mb-2">Gas - $30</li>
          <li className="mb-2">Movie Tickets - $25</li>
        </ul>
      </div>
    </div>
  )
}

export default Dashboard

