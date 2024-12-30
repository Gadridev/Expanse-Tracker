import React, { useState } from 'react';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';

// Mock data for demonstration
const mockCategories: Category[] = [
  { id: '1', name: 'Food', color: '#FF5733' },
  { id: '2', name: 'Transport', color: '#33FF57' },
  { id: '3', name: 'Entertainment', color: '#3357FF' },
];

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expenseWithId = { ...newExpense, id: Date.now().toString() };
    setExpenses([...expenses, expenseWithId]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Add New Expense</h2>
          <ExpenseForm onSubmit={handleAddExpense} categories={mockCategories} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Recent Expenses</h2>
          <ExpenseList expenses={expenses} categories={mockCategories} />
        </div>
      </div>
    </div>
  );
}

