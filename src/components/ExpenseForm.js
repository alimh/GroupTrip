import React from 'react';
import { FormBuilder } from './FormComponents';
import { checkValidDateError, checkPositiveNumberError } from '../utils/FormValidation';

export const ExpenseForm = (props) => {
  const {
    date, paidBy, splitBy, note, amount, category,
    users, categories,
    onSave, onCancel,
  } = props;

  const today = new Date();
  const userList = users.map(user => ({ value: user.value, key: user.id, checked: false }));
  // add logic to above statement to check splitBy

  const fields = [
    {
      id: 'date',
      name: 'Date',
      initialValue: date || today.toDateString(),
      errorChecks: value => checkValidDateError(value),
    },
    {
      id: 'note',
      name: 'Note',
      initialValue: note,
      placeholder: 'What is the expense for?',
    },
    {
      id: 'amount',
      name: 'Amount',
      initialValue: amount,
      errorChecks: value => checkPositiveNumberError(value),
    },
    {
      type: 'select-box',
      id: 'categories',
      name: 'Category',
      initialValue: category,
      options: categories ? categories.map(c => ({ key: c.id, value: c.value })) : [],
    },
    {
      type: 'multi-select',
      id: 'users',
      name: 'Split By',
      options: userList,
      initialValue: userList,
    //   errorChecks: (value) => {
    //     const oneSelected = value.reduce((acc, item) => acc || item.checked, false);
    //     return oneSelected ? false : 'Please select at least one name';
    //   },
    },
    {
      type: 'select-box',
      id: 'paidBy',
      name: 'Paid By',
      initialValue: paidBy,
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
