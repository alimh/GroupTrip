import React from 'react';
import Card from 'react-bootstrap/Card';

import { FormBuilder } from './FormComponents';
import {
  checkValidDateError,
  checkPositiveNumberError,
} from '../utils/FormValidation';

export const ExpenseForm = (props) => {
  const { travelers, categories } = props;
  const { onSave, onCancel } = props;

  const { dateFormatted, paidBy, note } = props.expenseObj || {};
  const { amount, category, splitBy } = props.expenseObj || {};

  const { borderVariant } = props || 'light';

  const today = new Date();
  const keyForm = Math.random();

  // const heading = !props.expenseObj ? 'Add New Expense' : 'Edit Expense';

  const fields = [
    {
      id: 'date',
      label: 'Date',
      initialValue:
        dateFormatted ||
        today.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'long',
          day: '2-digit',
          year: 'numeric',
        }),
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
      placeholder: 'Amount',
      prepend: '$',
      errorChecks: value => checkPositiveNumberError(value),
    },
    {
      type: 'select-box',
      id: 'category',
      label: 'Category',
      initialValue: category
        ? { value: category.name, key: category.id }
        : null,
      options: categories
        ? categories.map((c, n) => ({ key: n, value: c }))
        : [],
    },
    {
      type: 'multi-select',
      id: 'splitBy',
      label: 'Split By',
      options:
        travelers.map((user, n) => ({
          value: user,
          key: n,
          checked: false,
        })) || [],
      initialValue: splitBy
        ? splitBy.map((s, n) => ({ value: s, key: n, checked: true }))
        : [],
    },
    {
      type: 'select-box',
      id: 'paidBy',
      label: 'Paid By',
      initialValue: paidBy ? { value: paidBy.name, key: paidBy.id } : null,
      options: travelers ? travelers.map((u, n) => ({ key: n, value: u })) : [],
    },
  ];

  return (
    <Card border={borderVariant}>
      <Card.Body>
        <FormBuilder
          key={keyForm}
          fields={fields}
          onSave={fieldValues => onSave(fieldValues)}
          onCancel={() => onCancel()}
          formatItem={(field, key) => <div key={key}>{field}</div>}
          formatWrapper={e => <div>{e}</div>}
        />
      </Card.Body>
    </Card>
  );
};

export default ExpenseForm;
