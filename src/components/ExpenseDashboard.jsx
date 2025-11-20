import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useExpense } from "../hooks/useExpense";
import CategoryCard from "./CategoryCard";
import CategoryForm from "./CategoryForm";
import ExpenseForm from "./ExpenseForm";
import { FiPlus, FiTrendingUp, FiLogOut } from "react-icons/fi";

const ExpenseDashboard = () => {
  const navigate = useNavigate();
  const {
    categories,
    expenses,
    deleteCategory,
    deleteExpense,
    getTotalExpenses,
    getExpensesByCategory,
    logout,
    loading,
  } = useExpense();

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);

  const handleAddExpense = (categoryName) => {
    setSelectedCategoryName(categoryName);
    setShowExpenseForm(true);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId, type } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    console.log("Dragged:", draggableId);
    console.log("From:", source.droppableId);
    console.log("To:", destination.droppableId);
    // Handle drag and drop logic here if needed (e.g., reorganizing)
  };

  const totalExpenses = getTotalExpenses();
  const categoryNames = Object.keys(categories);

  // Show loading screen while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          </div>
          <p className="text-gray-700 text-lg font-semibold">
            Loading your expenses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Expense Tracker
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your categories and expenses with ease
              </p>
            </div>
            <div className="flex items-center gap-4">
              <FiTrendingUp className="text-4xl text-blue-500" />
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition flex items-center gap-2"
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <p className="text-sm opacity-90">Total Expenses</p>
              <p className="text-3xl font-bold mt-2">
                ${totalExpenses.toFixed(2)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
              <p className="text-sm opacity-90">Categories</p>
              <p className="text-3xl font-bold mt-2">{categoryNames.length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <p className="text-sm opacity-90">Total Expenses Count</p>
              <p className="text-3xl font-bold mt-2">{expenses.length}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowExpenseForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition flex items-center gap-2 shadow-md"
          >
            <FiPlus size={20} />
            Add Expense
          </button>
          <button
            onClick={() => setShowCategoryForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition flex items-center gap-2 shadow-md"
          >
            <FiPlus size={20} />
            Add Category
          </button>
        </div>

        {/* Categories Grid */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="categories" type="CATEGORY">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 ${
                  snapshot.isDraggingOver ? "bg-blue-100 rounded-lg p-4" : ""
                }`}
              >
                {categoryNames.length > 0 ? (
                  categoryNames
                    .filter(
                      (categoryName) =>
                        getExpensesByCategory(categoryName).length > 0
                    )
                    .map((categoryName, index) => (
                      <CategoryCard
                        key={categoryName}
                        categoryName={categoryName}
                        index={index}
                        expenses={getExpensesByCategory(categoryName)}
                        onDeleteExpense={deleteExpense}
                        onDeleteCategory={deleteCategory}
                        onAddExpense={handleAddExpense}
                      />
                    ))
                ) : (
                  <div className="col-span-full bg-white rounded-xl shadow-md p-12 text-center">
                    <p className="text-gray-500 text-lg mb-4">
                      No categories yet. Create one to get started!
                    </p>
                    <button
                      onClick={() => setShowCategoryForm(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition inline-flex items-center gap-2"
                    >
                      <FiPlus size={18} />
                      Create First Category
                    </button>
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Modals */}
      {showCategoryForm && (
        <CategoryForm onClose={() => setShowCategoryForm(false)} />
      )}
      {showExpenseForm && (
        <ExpenseForm
          categoryName={selectedCategoryName}
          onClose={() => {
            setShowExpenseForm(false);
            setSelectedCategoryName(null);
          }}
        />
      )}
    </div>
  );
};

export default ExpenseDashboard;
