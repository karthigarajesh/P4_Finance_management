import React, { createContext, useState } from "react";

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);

  // Add Expense
  const addExpense = (expense) => {
    setExpenses([...expenses, { id: Date.now(), ...expense }]);
  };

  // Edit Expense
  const editExpense = (updatedExpense) => {
    setExpenses(expenses.map(expense => expense.id === updatedExpense.id ? updatedExpense : expense));
  };

  // Delete Expense
  const deleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, editExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseContext;
