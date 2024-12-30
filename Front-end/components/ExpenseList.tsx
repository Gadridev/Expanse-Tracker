import React from 'react';
import { Table } from "@/components/ui/table"

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
}

export function ExpenseList({ expenses, categories }: ExpenseListProps) {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Date</Table.Head>
          <Table.Head>Description</Table.Head>
          <Table.Head>Category</Table.Head>
          <Table.Head>Amount</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {expenses.map((expense) => {
          const category = categories.find(c => c.id === expense.categoryId);
          return (
            <Table.Row key={expense.id}>
              <Table.Cell>{expense.date.toLocaleDateString()}</Table.Cell>
              <Table.Cell>{expense.description}</Table.Cell>
              <Table.Cell>{category?.name || 'Uncategorized'}</Table.Cell>
              <Table.Cell>${expense.amount.toFixed(2)}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}

