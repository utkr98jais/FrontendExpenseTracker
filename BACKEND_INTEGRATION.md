# Backend Integration Guide

## Overview

This guide explains how to connect your Expense Tracker frontend to a backend API. The current frontend uses local state management, but it's ready to be integrated with any REST API.

## API Endpoints Required

Your backend should provide these endpoints:

### Categories Endpoints

```
GET    /api/categories              # Get all categories
POST   /api/categories              # Create new category
PUT    /api/categories/:id          # Update category
DELETE /api/categories/:id          # Delete category
```

### Expenses Endpoints

```
GET    /api/expenses                # Get all expenses
POST   /api/expenses                # Create new expense
PUT    /api/expenses/:id            # Update expense
DELETE /api/expenses/:id            # Delete expense
```

## Expected Data Models

### Category Object

```json
{
  "id": "string or number",
  "name": "string",
  "color": "string (e.g., 'bg-red-500')",
  "icon": "string (emoji)",
  "userId": "string (optional)",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

### Expense Object

```json
{
  "id": "string or number",
  "categoryId": "string or number",
  "amount": "number",
  "description": "string",
  "userId": "string (optional)",
  "date": "ISO date string",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

## Setting Up Backend Integration

### Step 1: Configure API Endpoint

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Update your code to use this:

```javascript
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
```

### Step 2: Replace Current Context

Use the `ExpenseContext.backend.example.jsx` file as a template:

1. Copy the content from `ExpenseContext.backend.example.jsx`
2. Replace the current `ExpenseContext.jsx` with the backend version
3. Install dependencies if needed: `npm install axios`

### Step 3: Handle Loading States

Update your components to handle loading states:

```jsx
import { useExpense } from "../../hooks/useExpense";

const MyComponent = () => {
  const { categories, expenses, loading, error } = useExpense();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    // Your component JSX
  );
};
```

### Step 4: Handle Authentication

The context expects a token in localStorage:

```javascript
// After login, store the token
localStorage.setItem("token", authToken);

// The context will automatically include it in requests
const getAuthToken = () => localStorage.getItem("token");
```

## Example Backend Implementation (Node.js + Express)

Here's a basic backend structure to get you started:

### Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^7.0.0",
    "dotenv": "^16.0.0",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0"
  }
}
```

### Models

#### Category Model

```javascript
const categorySchema = new Schema({
  name: { type: String, required: true },
  color: String,
  icon: String,
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

#### Expense Model

```javascript
const expenseSchema = new Schema({
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  amount: { type: Number, required: true },
  description: String,
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

### Routes Example

#### Category Routes

```javascript
// GET /api/categories
router.get("/categories", authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user.id });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/categories
router.post("/categories", authMiddleware, async (req, res) => {
  try {
    const category = new Category({
      ...req.body,
      userId: req.user.id,
    });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/categories/:id
router.delete("/categories/:id", authMiddleware, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    // Also delete all expenses in this category
    await Expense.deleteMany({ categoryId: req.params.id });

    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Expense Routes

```javascript
// GET /api/expenses
router.get("/expenses", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/expenses
router.post("/expenses", authMiddleware, async (req, res) => {
  try {
    const expense = new Expense({
      ...req.body,
      userId: req.user.id,
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/expenses/:id
router.delete("/expenses/:id", authMiddleware, async (req, res) => {
  try {
    await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## CORS Configuration

Make sure your backend includes CORS headers:

```javascript
const cors = require("cors");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
```

## Error Handling

Add error handling in your components:

```jsx
const handleAddExpense = async (categoryId) => {
  try {
    setSelectedCategoryId(categoryId);
    setShowExpenseForm(true);
  } catch (error) {
    toast.error(error.message);
  }
};
```

Add toast notifications from `react-hot-toast`:

```javascript
import toast from "react-hot-toast";

const { addExpense } = useExpense();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await addExpense(categoryId, amount, description);
    toast.success("Expense added!");
  } catch (error) {
    toast.error(error.message);
  }
};
```

## Authentication Flow

1. User logs in (call your login endpoint)
2. Receive JWT token
3. Store token: `localStorage.setItem("token", token)`
4. Context automatically includes token in all requests
5. Backend validates token in middleware
6. If token expires, handle 401 response and redirect to login

## Migration Steps

### From Local State to Backend:

1. **Phase 1**: Keep local state for UI responsiveness
2. **Phase 2**: Add API calls for persistence
3. **Phase 3**: Add optimistic updates for better UX
4. **Phase 4**: Add error handling and retry logic

Example of optimistic update:

```javascript
const addExpense = async (categoryId, amount, description) => {
  // Optimistic update
  const tempExpense = {
    id: `temp-${Date.now()}`,
    categoryId,
    amount: parseFloat(amount),
    description,
    date: new Date().toISOString(),
  };

  setExpenses((prev) => [...prev, tempExpense]);

  try {
    // Call backend
    const response = await axios.post(`${API_BASE_URL}/expenses`, {
      categoryId,
      amount: parseFloat(amount),
      description,
    });

    // Update with real ID from backend
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === tempExpense.id ? response.data : exp))
    );

    return response.data;
  } catch (error) {
    // Rollback on error
    setExpenses((prev) => prev.filter((exp) => exp.id !== tempExpense.id));
    throw error;
  }
};
```

## Testing the Integration

1. Start your backend server
2. Update `.env` with correct API URL
3. Restart frontend dev server
4. Test CRUD operations
5. Check network tab in DevTools

## Common Issues

### CORS Errors

- Enable CORS on backend
- Check origin configuration
- Ensure credentials are handled correctly

### 401 Unauthorized

- Token not being sent
- Token expired
- Token invalid

### 404 Not Found

- Wrong API endpoint
- Wrong API_URL configuration
- Backend route not implemented

### Network Timeouts

- Backend server not running
- Wrong server address
- Network connectivity issues

## Next Steps

Once backend integration is complete:

1. Add data validation on frontend
2. Implement caching for better performance
3. Add offline support with service workers
4. Implement real-time updates with WebSockets
5. Add advanced filtering and search

---

For more information, refer to the main `FRONTEND_README.md` file.
