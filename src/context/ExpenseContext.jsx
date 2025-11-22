import React, { createContext, useState, useCallback, useEffect } from "react";
import client from "../api/client";

const API_BASE_URL = "http://localhost:8081";

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [categories, setCategories] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);

  // Fetch expenses from backend
  const fetchExpensesFromBackend = useCallback(async (uname, categoriesObj) => {
    setError(null);
    try {
      const response = await client.get(`/expenses`, {
        params: { username: uname },
      });
      console.log("Expenses response:", response.data);
      if (response.data) {
        const allExpenses = [];
        const foundCategories = new Set();

        // Create a mapping of lowercase category names to their proper casing
        const categoryMapping = {};
        Object.keys(categoriesObj || {}).forEach((cat) => {
          categoryMapping[cat.toLowerCase()] = cat;
        });

        // Handle both response structures
        const categoryWiseExpenses =
          response.data.categoryWiseExpenses ||
          response.data.expenseCategoryWiseList ||
          {};

        if (Array.isArray(categoryWiseExpenses)) {
          categoryWiseExpenses.forEach((categoryData) => {
            let categoryName =
              categoryData.category || categoryData.categoryName;
            categoryName =
              categoryMapping[categoryName.toLowerCase()] || categoryName;
            foundCategories.add(categoryName);
            if (categoryData.expenses && Array.isArray(categoryData.expenses)) {
              categoryData.expenses.forEach((exp) => {
                allExpenses.push({
                  ...exp,
                  category: categoryName,
                });
              });
            }
          });
        } else {
          Object.entries(categoryWiseExpenses).forEach(
            ([category, expenseList]) => {
              let normalizedCategory =
                categoryMapping[category.toLowerCase()] || category;
              foundCategories.add(normalizedCategory);
              if (Array.isArray(expenseList)) {
                expenseList.forEach((exp) => {
                  allExpenses.push({
                    ...exp,
                    category: normalizedCategory,
                  });
                });
              }
            }
          );
        }

        console.log("Parsed expenses:", allExpenses);
        setCategories((prevCategories) => {
          const updatedCategories = { ...prevCategories };
          const categoryMap = new Map();

          Object.keys(updatedCategories).forEach((cat) => {
            categoryMap.set(cat.toLowerCase(), cat);
          });

          foundCategories.forEach((cat) => {
            const lowerCat = cat.toLowerCase();
            if (!categoryMap.has(lowerCat)) {
              updatedCategories[cat] = cat;
              categoryMap.set(lowerCat, cat);
            }
          });

          return updatedCategories;
        });

        setExpenses(allExpenses);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching expenses:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize session immediately after a successful login
  // Sets username state and triggers initial data fetch without requiring a full page refresh
  const initializeSession = useCallback((uname) => {
    if (!uname) return;
    // Setting username is enough; the username effect will trigger the initial fetch
    setUsername(uname);
  }, []);

  // Fetch user data and initialize categories
  const fetchUserAndCategories = useCallback(
    async (uname) => {
      setLoading(true);
      setError(null);
      try {
        const response = await client.get(`/users`, {
          params: { username: uname },
        });
        console.log("User response data:", response.data);
        if (response.data && response.data.categories) {
          const categoriesObj = {};
          const categoriesArray = Array.isArray(response.data.categories)
            ? response.data.categories
            : Object.keys(response.data.categories);

          categoriesArray.forEach((cat) => {
            categoriesObj[cat] = cat;
          });

          console.log("Converted categories object:", categoriesObj);
          setCategories(categoriesObj);
          await fetchExpensesFromBackend(uname, categoriesObj);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching user:", err);
        setLoading(false);
      }
    },
    [fetchExpensesFromBackend]
  );

  // Get token and username from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (token && storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Fetch data when username is set
  useEffect(() => {
    if (username) {
      fetchUserAndCategories(username);
    }
  }, [username, fetchUserAndCategories]);

  // Category operations
  const addCategory = useCallback(
    async (name) => {
      if (!username) return;
      try {
        await client.post(
          `/categories/category`,
          {},
          { params: { username, category: name } }
        );
        await fetchUserAndCategories(username);
      } catch (err) {
        console.error("Error adding category:", err);
        setError(err.message);
      }
    },
    [username, fetchUserAndCategories]
  );

  const deleteCategory = useCallback(
    async (categoryName) => {
      if (!username) return;
      try {
        await client.delete(`/categories/category`, {
          params: { username, category: categoryName },
        });
        await fetchUserAndCategories(username);
      } catch (err) {
        console.error("Error deleting category:", err);
        setError(err.message);
      }
    },
    [username, fetchUserAndCategories]
  );

  // Expense operations
  const addExpense = useCallback(
    async (category, amount, description, dateString, timeString) => {
      if (!username) return;
      try {
        let expenseDate;
        if (dateString && timeString) {
          expenseDate = new Date(`${dateString}T${timeString}`);
        } else if (dateString) {
          expenseDate = new Date(`${dateString}T12:00:00`);
        } else {
          expenseDate = new Date();
        }

        await client.post(`/expenses`, {
          username,
          category,
          amount: parseFloat(amount),
          description,
          date: expenseDate.toISOString(),
        });
        await fetchUserAndCategories(username);
      } catch (err) {
        console.error("Error adding expense:", err);
        setError(err.message);
      }
    },
    [username, fetchUserAndCategories]
  );

  const deleteExpense = useCallback(
    async (expenseId) => {
      if (!username) return;
      try {
        await client.delete(`/expenses`, {
          params: { expenseId, username },
        });
        await fetchUserAndCategories(username);
      } catch (err) {
        console.error("Error deleting expense:", err);
        setError(err.message);
      }
    },
    [username, fetchUserAndCategories]
  );

  const getExpensesByCategory = useCallback(
    (categoryName) => {
      return expenses.filter(
        (exp) =>
          exp.category &&
          exp.category.toLowerCase() === categoryName.toLowerCase()
      );
    },
    [expenses]
  );

  const getTotalByCategory = useCallback(
    (categoryName) => {
      return expenses
        .filter(
          (exp) =>
            exp.category &&
            exp.category.toLowerCase() === categoryName.toLowerCase()
        )
        .reduce((sum, exp) => sum + exp.amount, 0);
    },
    [expenses]
  );

  const getTotalExpenses = useCallback(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const logout = useCallback(async () => {
    try {
      await client.post(`/auth/logout`, {});
    } catch (err) {
      console.error("Error logging out:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      setUsername(null);
      setCategories({});
      setExpenses([]);
      setError(null);
      setLoading(false);
    }
  }, []);

  const value = {
    categories,
    expenses,
    loading,
    error,
    username,
    initializeSession,
    addCategory,
    deleteCategory,
    addExpense,
    deleteExpense,
    getExpensesByCategory,
    getTotalByCategory,
    getTotalExpenses,
    fetchExpensesFromBackend,
    logout,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};
