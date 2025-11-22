# Expense Tracker Frontend

A modern, feature-rich expense tracking application built with React, featuring drag-and-drop functionality and category management.

## 🎯 Features

### ✨ Core Features

- **Drag & Drop Interface**: Drag expenses and categories to reorganize them
- **Category Management**: Create, edit, and delete expense categories with custom icons and colors
- **Expense Management**: Add and delete expenses with descriptions and amounts
- **Real-time Calculations**: View total expenses by category and overall
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Built with Tailwind CSS for a beautiful, clean interface

### 📊 Dashboard

- Summary cards showing total expenses, category count, and expense count
- Color-coded category cards with gradients
- Visual expense organization by category
- Quick action buttons for adding categories and expenses

## 🛠️ Tech Stack

- **React 19** - UI framework
- **React Router DOM v7** - Client-side routing
- **@hello-pangea/dnd** - Drag and drop functionality
- **Tailwind CSS v4** - Utility-first styling
- **React Icons** - Icon library
- **Axios** - HTTP client
- **Moment.js** - Date formatting
- **React Hot Toast** - Toast notifications
- **Recharts** - Data visualization

## 📁 Project Structure

```
src/
├── components/
│   ├── ExpenseDashboard.jsx      # Main dashboard with drag-drop context
│   ├── CategoryCard.jsx           # Category card component with expenses
│   ├── CategoryForm.jsx           # Modal form for adding categories
│   └── ExpenseForm.jsx            # Modal form for adding expenses
├── context/
│   └── ExpenseContext.jsx         # Global state management
├── hooks/
│   └── useExpense.js              # Custom hook for expense context
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── SignUp.jsx
│   └── dashboard/
│       ├── Home.jsx
│       ├── Income.jsx
│       └── Expense.jsx
├── App.jsx                        # Main app component with routing
└── main.jsx                       # Entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to:

```
http://localhost:5173
```

## 📖 Usage Guide

### Creating a Category

1. Click the "Add Category" button in the header
2. Fill in the category name
3. Choose a color from the color palette
4. Select an icon that represents the category
5. Click "Add Category"

### Adding an Expense

1. Click the "Add Expense" button on any category card
2. Enter the expense amount
3. Add a description (e.g., "Lunch at restaurant")
4. Click "Add Expense"

### Deleting an Expense

- Click the trash icon on any expense item to delete it

### Deleting a Category

- Click the trash icon on the category header to delete the category and all its expenses

### Dragging & Dropping

- You can drag expense cards around within a category
- You can drag category cards to reorganize them on the dashboard
- Dragged items highlight to show their current position

## 🎨 Customization

### Changing Default Colors

Edit `src/components/CategoryForm.jsx` to modify the available color options:

```javascript
const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-purple-500",
  // Add more colors here
];
```

### Changing Default Icons

Edit `src/components/CategoryForm.jsx` to modify available icons:

```javascript
const icons = ["🍔", "🚗", "🎬", "🛍️", "💡", "🏠", "💊", "📚"];
```

### Modifying Initial Data

Edit `src/context/ExpenseContext.jsx` to change sample categories and expenses.

## 🔄 State Management

The app uses React Context API for global state management through `ExpenseContext`:

```javascript
const {
  categories,
  expenses,
  addCategory,
  deleteCategory,
  addExpense,
  deleteExpense,
  getTotalByCategory,
  getTotalExpenses,
} = useExpense();
```

## 🎯 Available Methods in ExpenseContext

| Method                                        | Purpose                            |
| --------------------------------------------- | ---------------------------------- |
| `addCategory(name, color, icon)`              | Add a new category                 |
| `deleteCategory(categoryId)`                  | Delete a category and its expenses |
| `updateCategory(categoryId, updates)`         | Update category properties         |
| `addExpense(categoryId, amount, description)` | Add expense to a category          |
| `deleteExpense(expenseId)`                    | Delete an expense                  |
| `updateExpense(expenseId, updates)`           | Update expense properties          |
| `getExpensesByCategory(categoryId)`           | Get all expenses for a category    |
| `getTotalByCategory(categoryId)`              | Get total expenses for a category  |
| `getTotalExpenses()`                          | Get total of all expenses          |

## 🔮 Future Enhancements

- [ ] Backend integration with API calls
- [ ] User authentication
- [ ] Persistent data storage
- [ ] Data export (CSV, PDF)
- [ ] Charts and analytics
- [ ] Budget limits per category
- [ ] Expense filtering and search
- [ ] Monthly/yearly reports
- [ ] Multi-user support

## 🐛 Troubleshooting

### Drag and drop not working

- Ensure `@hello-pangea/dnd` is properly installed
- Check that `DragDropContext` wraps the droppable areas

### Styles not applying

- Make sure Tailwind CSS is configured correctly
- Run `npm run build` to rebuild styles

### Dependencies missing

- Run `npm install` to install all dependencies
- Check `package.json` for the required versions

## 📝 Notes

- All data is stored in React state (localStorage can be added for persistence)
- The app includes sample data on initial load
- Date formatting uses Moment.js
- Responsive grid layout adjusts from 1 column (mobile) to 3 columns (desktop)

## 🤝 Contributing

Feel free to extend this project with additional features and improvements!
