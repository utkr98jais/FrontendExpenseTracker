# 🚀 Quick Start Guide - Expense Tracker

## What I've Created For You

Your expense tracker frontend now includes:

### ✅ Key Features Implemented

1. **Drag & Drop Interface**

   - Drag expense cards within categories
   - Reorganize category cards on the dashboard
   - Visual feedback while dragging

2. **Category Management**

   - Create new categories with custom icons and colors
   - Delete categories (removes all associated expenses)
   - 8 pre-configured color options
   - 8 emoji icons to choose from

3. **Expense Tracking**

   - Add expenses to any category
   - Track amount and description
   - Automatic date stamping
   - Delete individual expenses
   - View total expenses per category

4. **Beautiful Dashboard**
   - Summary cards showing key metrics
   - Gradient category cards
   - Responsive grid layout
   - Modern UI with Tailwind CSS

## 📦 Files Created

### Components

- `src/components/ExpenseDashboard.jsx` - Main dashboard with drag-drop
- `src/components/CategoryCard.jsx` - Category cards with expenses
- `src/components/CategoryForm.jsx` - Add category modal
- `src/components/ExpenseForm.jsx` - Add expense modal

### State Management

- `src/context/ExpenseContext.jsx` - Global state with all operations
- `src/hooks/useExpense.js` - Custom hook for easy access

### Updated Files

- `src/App.jsx` - Updated to use new dashboard
- `src/main.jsx` - Wrapped with ExpenseProvider

## 🎯 How to Use

### Start Development Server

```bash
cd frontend/expense-tracker
npm run dev
```

### Create a Category

1. Click "Add Category" button
2. Enter category name
3. Pick a color (red, blue, purple, pink, yellow, green, indigo, orange)
4. Choose an icon
5. Click "Add Category"

### Add Expenses

1. Click "Add Expense" on any category card
2. Enter amount and description
3. Click "Add Expense"

### Delete Items

- Click trash icon on any expense to delete it
- Click trash icon on category header to delete entire category

### Drag & Drop

- Click and drag expense cards to reorganize
- Click and drag category cards to rearrange them

## 🔧 Default Categories (Sample Data)

The app comes with 5 sample categories:

- 🍔 Food
- 🚗 Transportation
- 🎬 Entertainment
- 🛍️ Shopping
- 💡 Utilities

And 2 sample expenses to get you started.

## 🎨 Customization Options

### Add More Colors

Edit `src/components/CategoryForm.jsx` - add colors to the `colors` array

### Add More Icons

Edit `src/components/CategoryForm.jsx` - add emojis to the `icons` array

### Change Initial Data

Edit `src/context/ExpenseContext.jsx` - modify `useState` initial values

## 📊 Statistics Available

The dashboard shows:

- Total Expenses (sum of all amounts)
- Number of Categories
- Total Count of Expenses
- Per-category totals in category headers

## 🔄 State Management API

Use the `useExpense()` hook anywhere to access:

```javascript
import { useExpense } from "./hooks/useExpense";

const MyComponent = () => {
  const {
    categories, // Array of category objects
    expenses, // Array of expense objects
    addCategory, // Function: (name, color, icon) => category
    deleteCategory, // Function: (categoryId) => void
    addExpense, // Function: (categoryId, amount, description) => expense
    deleteExpense, // Function: (expenseId) => void
    getTotalExpenses, // Function: () => number
    getTotalByCategory, // Function: (categoryId) => number
    getExpensesByCategory, // Function: (categoryId) => expense[]
  } = useExpense();
};
```

## 🎯 Next Steps

1. **Customize Colors & Icons**

   - Edit the options in CategoryForm.jsx to match your preferences

2. **Connect to Backend**

   - Replace the sample data with API calls using axios
   - Update context methods to call your backend endpoints

3. **Add Persistence**

   - Store data in localStorage for offline support
   - Add backend database integration

4. **Enhance Features**
   - Add expense filtering
   - Create charts and analytics
   - Add budget limits
   - Create monthly reports

## 📱 Responsive Design

The app is fully responsive:

- **Mobile**: 1 column layout
- **Tablet**: 2 column layout
- **Desktop**: 3 column layout
- **Ultra-wide**: 3+ columns

## 🎯 Testing the App

1. Create a few categories
2. Add multiple expenses to different categories
3. Try dragging expenses and categories
4. Delete expenses and see totals update
5. Delete a category and see all its expenses removed

## ❓ Troubleshooting

**Drag & Drop not working?**

- Ensure `@hello-pangea/dnd` is installed: `npm install`

**Styles look off?**

- Restart dev server: `npm run dev`
- Clear browser cache: Cmd+Shift+Delete on macOS

**Import errors?**

- Run `npm install` to ensure all dependencies are installed

## 🎉 You're All Set!

Your expense tracker is ready to use! Customize it to your needs and enjoy tracking your expenses with style.

Happy expense tracking! 💰
