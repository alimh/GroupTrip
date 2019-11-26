import React from 'react';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

import { FormBuilder } from './FormComponents';
import {
  checkValidDateError,
  checkPositiveNumberError,
  checkNotBlankError,
} from '../utils/FormValidation';

export const ExpenseForm = (props) => {
  const { travelers, categories } = props;
  const { onSave, onCancel, onRemove } = props;
  // if the expense is editable based on login or if it is a new expense
  const canEdit = props.expenseObj === null || props.expenseObj.canEdit;

  const label = () => {
    if (!props.expenseObj) return false;
    if (props.expenseObj.removed_at) {
      return <Badge variant="danger">Removed</Badge>;
    }
    if (props.expenseObj.needsAttention && canEdit) {
      return <Badge variant="warning">Incomplete</Badge>;
    }
    return <div key="blank-label" />;
  };

  const { date, paidBy = { id: '' }, note } = props.expenseObj || {};
  const { amount, category = { id: '' }, splitBy } = props.expenseObj || {};

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
      type: 'date-picker',
      initialValue: date ? new Date(date) : today,
      errorChecks: value => checkValidDateError(value),
    },
    {
      id: 'note',
      label: 'Note',
      initialValue: note,
      placeholder: 'What is the expense for?',
      errorChecks: value => checkNotBlankError(value),
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
      initialValue:
        category.id !== ''
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
      initialValue:
        paidBy.id !== ''
          ? { value: travelers[paidBy.id].label, key: paidBy.id }
          : null,
      options: paidByActive.map(u => ({
        key: u.id,
        value: travelers[u.id || 0].label,
      })),
    },
  ];

  const showRemoveButton = props.expenseObj ? () => onRemove() : false;
  return (
    <Card border={borderVariant}>
      <Card.Body>
        <span className="float-right">{label()}</span>
        <FormBuilder
          key={keyForm}
          fields={fields}
          onSave={fieldValues => onSave(fieldValues)}
          onCancel={() => onCancel()}
          onRemove={showRemoveButton}
          formatItem={(field, key) => <div key={key}>{field}</div>}
          formatWrapper={e => <div>{e}</div>}
          viewOnly={!canEdit}
        />
      </Card.Body>
    </Card>
  );
};

export default ExpenseForm;
