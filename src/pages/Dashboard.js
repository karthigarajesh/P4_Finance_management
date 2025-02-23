import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="container">
      <h1>Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/expenses">Manage Expenses</Link></li>
          <li><Link to="/logout">Logout</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;
