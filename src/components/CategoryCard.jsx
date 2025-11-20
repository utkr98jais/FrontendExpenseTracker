import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { useExpense } from "../hooks/useExpense";

const ExpenseItem = ({ expense, index, onDelete, onAddClick }) => {
  return (
    <Draggable draggableId={expense.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500 ${
            snapshot.isDragging ? "shadow-lg opacity-90" : ""
          } hover:shadow-md transition`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-gray-800 font-medium">{expense.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => onDelete(expense.id)}
              className="text-red-500 hover:text-red-700 p-2 transition"
              title="Delete expense"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
          <p className="text-lg font-bold text-blue-600 mt-2">
            ${expense.amount.toFixed(2)}
          </p>
        </div>
      )}
    </Draggable>
  );
};

const CategoryCard = ({
  categoryName,
  expenses,
  onDeleteExpense,
  onDeleteCategory,
  onAddExpense,
  index,
}) => {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <Draggable draggableId={`cat-${categoryName}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md overflow-hidden transition-all ${
            snapshot.isDragging ? "shadow-2xl scale-102" : ""
          }`}
        >
          {/* Category Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex items-center justify-between">
            <div
              className="flex items-center gap-3"
              {...provided.dragHandleProps}
            >
              <div>
                <h3 className="text-lg font-bold">{categoryName}</h3>
                <p className="text-sm opacity-90">${total.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={() => onDeleteCategory(categoryName)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
              title="Delete category"
            >
              <FiTrash2 size={20} />
            </button>
          </div>

          {/* Expenses Container */}
          <Droppable droppableId={categoryName} type="EXPENSE">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`p-4 min-h-[200px] space-y-2 ${
                  snapshot.isDraggingOver ? "bg-blue-50" : ""
                }`}
              >
                {expenses.length > 0 ? (
                  expenses.map((expense, idx) => (
                    <ExpenseItem
                      key={expense.id}
                      expense={expense}
                      index={idx}
                      onDelete={onDeleteExpense}
                      onAddClick={onAddExpense}
                    />
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    No expenses yet
                  </p>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Add Expense Button */}
          <div className="px-4 pb-4">
            <button
              onClick={() => onAddExpense(categoryName)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              <FiPlus size={18} />
              Add Expense
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default CategoryCard;
