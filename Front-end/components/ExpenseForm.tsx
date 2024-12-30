import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  categories: Category[];
}

export function ExpenseForm({ onSubmit, categories }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      userId: 'current-user-id', // This would be dynamically set in a real app
      amount: parseFloat(amount),
      date: date!,
      categoryId,
      description,
      paymentMethod,
    });
    // Reset form
    setAmount('');
    setDescription('');
    setCategoryId('');
    setDate(new Date());
    setPaymentMethod('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        required
      />
      <Input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <Select
        value={categoryId}
        onValueChange={(value) => setCategoryId(value)}
        required
      >
        <Select.Trigger>
          <Select.Value placeholder="Select a category" />
        </Select.Trigger>
        <Select.Content>
          {categories.map((category) => (
            <Select.Item key={category.id} value={category.id}>
              {category.name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
      <DatePicker
        date={date}
        onDateChange={setDate}
      />
      <Input
        type="text"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        placeholder="Payment Method"
        required
      />
      <Button type="submit">Add Expense</Button>
    </form>
  );
}

