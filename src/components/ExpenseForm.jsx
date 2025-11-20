import React, { useState } from "react";
import { FiX, FiPlus } from "react-icons/fi";
import { useExpense } from "../hooks/useExpense";

const ExpenseForm = ({ categoryName, onClose }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const { addExpense, categories } = useExpense();

  // Get the first category or use the one passed in
  const defaultCategory =
    categoryName || Object.keys(categories)[0] || "Miscellaneous";
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const isGlobalForm = !categoryName;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && description.trim()) {
      // Use selected category or default to first category
      const finalCategory =
        selectedCategory || Object.keys(categories)[0] || "Miscellaneous";
      addExpense(finalCategory, amount, description, date, time);
      setAmount("");
      setDescription("");
      setSelectedCategory(
        categoryName || Object.keys(categories)[0] || "Miscellaneous"
      );
      setDate("");
      setTime("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isGlobalForm ? "Add Expense" : `Add to ${categoryName}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isGlobalForm && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Lunch at restaurant"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date (Optional)
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time (Optional)
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium flex items-center justify-center gap-2"
            >
              <FiPlus size={18} />
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
