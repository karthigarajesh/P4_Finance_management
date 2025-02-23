import React, { useState, useContext } from "react";
import ExpenseContext from "../context/ExpenseContext";
import "./ExpenseDashboard.css"; // Add CSS for modal styling

const ExpenseDashboard = () => {
  const { expenses, addExpense, editExpense, deleteExpense } = useContext(ExpenseContext);
  const [newExpense, setNewExpense] = useState({ description: "", amount: "" });

  // State for Editing
  const [editData, setEditData] = useState(null);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (newExpense.description && newExpense.amount) {
      addExpense(newExpense);
      setNewExpense({ description: "", amount: "" });
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editData) {
      editExpense(editData);
      setEditData(null); // Close modal after update
    }
  };

  return (
    <div className="container">
      <h1>Expense Manager</h1>

      {/* Add Expense Form */}
      <form onSubmit={handleAddExpense}>
        <input 
          type="text" 
          placeholder="Description" 
          value={newExpense.description} 
          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} 
          required 
        />
        <input 
          type="number" 
          placeholder="Amount" 
          value={newExpense.amount} 
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} 
          required 
        />
        <button type="submit">Add Expense</button>
      </form>

      {/* List of Expenses */}
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.description} - ${expense.amount} 
            <button onClick={() => setEditData(expense)}>Edit</button>
            <button onClick={() => deleteExpense(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Edit Modal */}
      {editData && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Expense</h2>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                required
              />
              <input
                type="number"
                value={editData.amount}
                onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                required
              />
              <button type="submit">Update</button>
              <button type="button" onClick={() => setEditData(null)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseDashboard;
