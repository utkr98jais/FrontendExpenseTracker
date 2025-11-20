import React, { useState } from "react";
import { FiX, FiPlus } from "react-icons/fi";
import { useExpense } from "../hooks/useExpense";

const CategoryForm = ({ onClose }) => {
  const [name, setName] = useState("");
  const { addCategory } = useExpense();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Category form submitted with name:", name);
    if (name.trim()) {
      console.log("Adding category:", name);
      addCategory(name);
      setName("");
      onClose();
    } else {
      console.log("Category name is empty");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add Category</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Groceries"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
