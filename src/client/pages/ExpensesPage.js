import React from 'react';
import { ExpensesList } from '../data-access/ExpensesListDA';

export const ExpensesPage = () => (
  <div className="home">
    <h1>Expenses</h1>
    <ExpensesList />
  </div>
);

export default ExpensesPage;
