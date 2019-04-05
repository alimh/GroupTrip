import React from 'react';
// import Card from 'react-bulma-components/lib/components/card';
// import {
//   Field,
//   Control,
// } from 'react-bulma-components/lib/components/form';
import { FormBuilder } from './FormComponents';
import {
  checkValidDateError,
  checkPositiveNumberError,
} from '../utils/FormValidation';

export const ExpenseForm = (props) => {
  const {
 travelers, categories, onSave, onCancel 
} = props;

  const {
 date, paidBy, note, amount, category, splitBy 
} =
    props.expenseObj || {};

  console.log(props);
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
      placehodler: 'Amount',
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
  console.log('rendeirng expense form');
  return (
    <div>
      <div>
        <FormBuilder
          fields={fields}
          onSave={fieldValues => onSave(fieldValues)}
          onCancel={() => onCancel()}
          formatItem={(field, key) => <div key={key}>{field}</div>}
          formatWrapper={e => <div>{e}</div>}
        />
      </div>
    </div>
  );
};

export default ExpenseForm;
