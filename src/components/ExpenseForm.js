import React from 'react';
import { FormBuilder } from './FormComponents';
import { checkValidDateError, checkPositiveNumberError } from '../utils/FormValidation';

export const ExpenseForm = (props) => {
  const {
    date, paidBy, note, amount, category, splitBy,
    users, categories,
    onSave, onCancel,
  } = props;

  const today = new Date();

  const fields = [
    {
      id: 'date',
      label: 'Date',
      initialValue: date || today.toDateString(),
      errorChecks: value => checkValidDateError(value),
    },
    {
      id: 'note',
      label: 'Note',
      initialValue: note,
      placeholder: 'What is the expense for?',
    },
    {
      id: 'amount',
      label: 'Amount',
      initialValue: amount,
      errorChecks: value => checkPositiveNumberError(value),
    },
    {
      type: 'select-box',
      id: 'categories',
      label: 'Category',
      initialValue: category ? { value: category.name, key: category.id } : null,
      options: categories ? categories.map(c => ({ key: c.id, value: c.value })) : [],
    },
    {
      type: 'multi-select',
      id: 'users',
      label: 'Split By',
      options: users.map(user => ({ value: user.value, key: user.id, checked: false })) || [],
      initialValue: splitBy ? splitBy.map(s => ({ value: s.name, key: s.id, checked: true })) : [],
    },
    {
      type: 'select-box',
      id: 'paidBy',
      label: 'Paid By',
      initialValue: paidBy ? { value: paidBy.name, key: paidBy.id } : null,
      options: users ? users.map(u => ({ key: u.id, value: u.value })) : [],
    },
  ];

  return (
    <div>
      <FormBuilder
        fields={fields}
        onSave={fieldValues => onSave(fieldValues)}
        onCancel={() => onCancel()}
      />
    </div>
  );
};

export default ExpenseForm;
