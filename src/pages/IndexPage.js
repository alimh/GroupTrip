import React from 'react';
import { NewExpense } from '../components/NewExpense';

export const IndexPage = () => (
  <div className="home">
    <h1>Trip Name</h1>
    <NewExpense />
  </div>
);

export default IndexPage;
