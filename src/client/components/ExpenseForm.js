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

  // Filter out inactive travelers that are not already selected in the splitBy list
  const splitByActive = travelers.filter(t =>
    (t.active ? true : (splitBy || []).filter(s => s.id === t.id).length > 0));

  const categoryActive = categories.filter(c =>
    (c.active ? true : (category || { id: null }).id === c.id));

  const paidByActive = travelers.filter(t =>
    (t.active ? true : (paidBy || { id: null }).id === t.id));

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
        ? { value: categories[category.id].label, key: category.id }
        : null,
      options: categoryActive.map(c => ({
        key: c.id,
        value: c.label,
      })),
    },
    {
      type: 'multi-select',
      id: 'splitBy',
      label: 'Split By',
      options:
        splitByActive.map(user => ({
          value: user.label,
          key: user.id,
          checked: false,
        })) || [],
      initialValue: splitBy
        ? splitBy.map(s => ({
          value: travelers[s.id || 0].label,
          key: s.id,
          checked: true,
        }))
        : [],
    },
    {
      type: 'select-box',
      id: 'paidBy',
      label: 'Paid By',
      initialValue: paidBy
        ? { value: travelers[paidBy.id].label, key: paidBy.id }
        : null,
      options: paidByActive.map(u => ({
        key: u.id,
        value: travelers[u.id || 0].label,
      })),
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
