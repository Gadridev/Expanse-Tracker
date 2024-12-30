import React from 'react'

const Transactions = () => {
  const transactions = [
    { id: 1, date: '2023-08-15', description: 'Groceries', amount: 50 },
    { id: 2, date: '2023-08-14', description: 'Gas', amount: 30 },
    { id: 3, date: '2023-08-13', description: 'Movie Tickets', amount: 25 },
    { id: 4, date: '2023-08-12', description: 'Dinner', amount: 40 },
    { id: 5, date: '2023-08-11', description: 'Books', amount: 35 },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Date</th>
            <th className="text-left">Description</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.date}</td>
              <td>{transaction.description}</td>
              <td className="text-right">${transaction.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Transactions

