import React, { createContext, useState, useCallback, useEffect } from "react";
import axios from "axios";

export const ExpenseContext = createContext();

// Configure your API endpoint here
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const ExpenseProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get auth token from localStorage
  const getAuthToken = () => localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  };

  // Fetch categories from backend
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/categories`,
        axiosConfig
      );
      setCategories(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch expenses from backend
  const fetchExpenses = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/expenses`, axiosConfig);
      setExpenses(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError(err.message);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, [fetchCategories, fetchExpenses]);

  // Category operations
  const addCategory = useCallback(async (name, color, icon) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/categories`,
        { name, color, icon },
        axiosConfig
      );
      setCategories((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error("Error adding category:", err);
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteCategory = useCallback(async (categoryId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/categories/${categoryId}`,
        axiosConfig
      );
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      setExpenses((prev) =>
        prev.filter((exp) => exp.categoryId !== categoryId)
      );
    } catch (err) {
      console.error("Error deleting category:", err);
      setError(err.message);
      throw err;
    }
  }, []);

  const updateCategory = useCallback(async (categoryId, updates) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/categories/${categoryId}`,
        updates,
        axiosConfig
      );
      setCategories((prev) =>
        prev.map((cat) => (cat.id === categoryId ? response.data : cat))
      );
      return response.data;
    } catch (err) {
      console.error("Error updating category:", err);
      setError(err.message);
      throw err;
    }
  }, []);

  // Expense operations
  const addExpense = useCallback(async (categoryId, amount, description) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/expenses`,
        { categoryId, amount: parseFloat(amount), description },
        axiosConfig
      );
      setExpenses((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error("Error adding expense:", err);
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteExpense = useCallback(async (expenseId) => {
    try {
      await axios.delete(`${API_BASE_URL}/expenses/${expenseId}`, axiosConfig);
      setExpenses((prev) => prev.filter((exp) => exp.id !== expenseId));
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError(err.message);
      throw err;
    }
  }, []);

  const updateExpense = useCallback(async (expenseId, updates) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/expenses/${expenseId}`,
        updates,
        axiosConfig
      );
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === expenseId ? response.data : exp))
      );
      return response.data;
    } catch (err) {
      console.error("Error updating expense:", err);
      setError(err.message);
      throw err;
    }
  }, []);

  // Utility functions
  const getExpensesByCategory = useCallback(
    (categoryId) => {
      return expenses.filter((exp) => exp.categoryId === categoryId);
    },
    [expenses]
  );

  const getTotalByCategory = useCallback(
    (categoryId) => {
      return expenses
        .filter((exp) => exp.categoryId === categoryId)
        .reduce((sum, exp) => sum + exp.amount, 0);
    },
    [expenses]
  );

  const getTotalExpenses = useCallback(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const value = {
    categories,
    expenses,
    loading,
    error,
    addCategory,
    deleteCategory,
    updateCategory,
    addExpense,
    deleteExpense,
    updateExpense,
    getExpensesByCategory,
    getTotalByCategory,
    getTotalExpenses,
    fetchCategories,
    fetchExpenses,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};
