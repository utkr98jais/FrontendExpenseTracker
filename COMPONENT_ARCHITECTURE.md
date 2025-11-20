# 🎨 Component Architecture Guide

## Component Hierarchy

```
App (Router)
├── Root (Authentication check)
└── Routes
    ├── Login
    ├── SignUp
    └── Dashboard
        └── ExpenseDashboard (Main Container)
            ├── Header Section
            │   ├── Title
            │   └── Summary Cards (3 cards)
            ├── Action Buttons
            │   └── "Add Category" Button
            ├── DragDropContext (Drag & Drop wrapper)
            │   └── Droppable Categories Container
            │       └── CategoryCard (Draggable, Droppable)
            │           ├── Category Header (Draggable handle)
            │           │   ├── Icon
            │           │   ├── Name
            │           │   ├── Total Amount
            │           │   └── Delete Button
            │           ├── Expenses List (Droppable)
            │           │   └── ExpenseItem (Draggable)
            │           │       ├── Description
            │           │       ├── Date
            │           │       ├── Amount
            │           │       └── Delete Button
            │           └── "Add Expense" Button
            ├── CategoryForm Modal (Conditional)
            └── ExpenseForm Modal (Conditional)
```

## Component Details

### 1. ExpenseDashboard

**Location**: `src/components/ExpenseDashboard.jsx`

**Props**: None (uses context)

**State**:

- `showCategoryForm` - Boolean for category modal
- `showExpenseForm` - Boolean for expense modal
- `selectedCategoryId` - ID of category to add expense to

**Responsibilities**:

- Main layout and styling
- Drag-drop context management
- Modal state management
- Render all categories and expenses
- Handle drag events

**Key Features**:

- Header with title and summary
- 3 summary cards (total, categories count, expenses count)
- Responsive grid layout
- Empty state messaging

### 2. CategoryCard

**Location**: `src/components/CategoryCard.jsx`

**Props**:

```javascript
{
  category: Object,           // { id, name, color, icon }
  expenses: Array,            // Array of expense objects
  onDeleteExpense: Function,  // (expenseId) => void
  onDeleteCategory: Function, // (categoryId) => void
  onAddExpense: Function,     // (categoryId) => void
  index: Number              // For drag-drop
}
```

**Responsibilities**:

- Display category information
- Show category expenses
- Allow expense drag-drop
- Handle category deletion
- Trigger add expense modal

**Key Features**:

- Gradient background based on category color
- Draggable category card
- Droppable area for expenses
- Total amount calculation

### 3. ExpenseItem

**Location**: `src/components/CategoryCard.jsx` (nested)

**Props**:

```javascript
{
  expense: Object,           // { id, categoryId, amount, description, date }
  index: Number,             // For drag-drop
  onDelete: Function,        // (expenseId) => void
  onAddClick: Function       // Not used currently
}
```

**Responsibilities**:

- Display expense information
- Allow expense deletion
- Provide drag handle

**Key Features**:

- Draggable item
- Shows amount, description, date
- Delete button
- Hover effects

### 4. CategoryForm

**Location**: `src/components/CategoryForm.jsx`

**Props**:

```javascript
{
  onClose: Function; // () => void
}
```

**State**:

- `name` - Category name input
- `color` - Selected color
- `icon` - Selected icon

**Responsibilities**:

- Collect category information
- Provide color picker
- Provide icon picker
- Submit form

**Key Features**:

- Modal overlay
- Text input for name
- 8 color options
- 8 emoji icons
- Form validation

### 5. ExpenseForm

**Location**: `src/components/ExpenseForm.jsx`

**Props**:

```javascript
{
  categoryId: String,  // ID of category to add to
  onClose: Function    // () => void
}
```

**State**:

- `amount` - Expense amount
- `description` - Expense description

**Responsibilities**:

- Collect expense information
- Submit form
- Validate inputs

**Key Features**:

- Modal overlay
- Number input for amount
- Text input for description
- Category context display
- Form validation

## Data Flow

### Adding a Category

```
User clicks "Add Category"
  ↓
showCategoryForm = true
  ↓
CategoryForm renders
  ↓
User fills form and submits
  ↓
addCategory() called from context
  ↓
categories state updated
  ↓
ExpenseDashboard re-renders with new category
  ↓
CategoryCard renders for new category
```

### Adding an Expense

```
User clicks "Add Expense" on category
  ↓
onAddExpense(categoryId) called
  ↓
selectedCategoryId set
showExpenseForm = true
  ↓
ExpenseForm renders
  ↓
User fills form and submits
  ↓
addExpense(categoryId, amount, description) called
  ↓
expenses state updated
  ↓
getExpensesByCategory(categoryId) re-run
  ↓
CategoryCard gets new expenses array
  ↓
CategoryCard re-renders
  ↓
ExpenseItem renders for new expense
```

### Deleting an Expense

```
User clicks delete button on expense
  ↓
onDelete(expenseId) called
  ↓
deleteExpense(expenseId) from context
  ↓
expenses state updated (filtered)
  ↓
getExpensesByCategory re-run
  ↓
CategoryCard re-renders without deleted expense
```

### Dragging an Expense

```
User starts dragging expense
  ↓
@hello-pangea/dnd provides feedback
  ↓
Draggable component highlights
  ↓
Droppable area shows drop zone
  ↓
User releases (onDragEnd called)
  ↓
Can update categoryId if dropped in different category
  ↓
Expense is reorganized (current: same category only)
```

## Context API Integration

### useExpense Hook

**Location**: `src/hooks/useExpense.js`

```javascript
const {
  // State
  categories, // Category[]
  expenses, // Expense[]

  // Category methods
  addCategory, // (name, color, icon) => Category
  deleteCategory, // (categoryId) => void
  updateCategory, // (categoryId, updates) => void

  // Expense methods
  addExpense, // (categoryId, amount, description) => Expense
  deleteExpense, // (expenseId) => void
  updateExpense, // (expenseId, updates) => void

  // Utility methods
  getExpensesByCategory, // (categoryId) => Expense[]
  getTotalByCategory, // (categoryId) => number
  getTotalExpenses, // () => number
} = useExpense();
```

## Styling Patterns

### Tailwind CSS Classes Used

**Layout**:

- `grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3` - Responsive grid
- `flex flex-col`, `flex items-center justify-between` - Flexbox layouts
- `space-y-4`, `gap-4` - Spacing utilities

**Colors**:

- `bg-gradient-to-br from-blue-500 to-blue-600` - Gradient backgrounds
- `text-gray-800`, `text-blue-600` - Text colors
- `border-l-4 border-blue-500` - Border accents

**Effects**:

- `shadow-lg`, `shadow-md`, `shadow-sm` - Shadows
- `rounded-xl`, `rounded-lg` - Border radius
- `hover:bg-blue-600`, `transition` - Interactions
- `opacity-90`, `opacity-50` - Transparency

**States**:

- `isDragging` - Applied during drag
- `isDraggingOver` - Applied to drop zones
- `focus:outline-none focus:ring-2 focus:ring-blue-500` - Form focus

## Component Reusability

### ExpenseItem

- Rendered multiple times for each expense
- Props allow customization
- Can be extracted to separate file if needed

### CategoryCard

- Renders for each category
- Self-contained with internal ExpenseItem rendering
- Could be split further if needed

### Modal Forms

- Both forms follow same pattern
- Can be made into generic Form wrapper
- Easy to add more form types

## Performance Considerations

### Optimization Techniques Used

1. **useCallback**

   - Context methods wrapped in useCallback
   - Prevents unnecessary re-renders

2. **Selective Re-renders**

   - Only affected categories/expenses re-render
   - getExpensesByCategory runs only when needed

3. **Memoization Potential**
   - Components could be wrapped with React.memo
   - Droppable areas use type system for efficiency

### Potential Improvements

```javascript
// Could add React.memo to prevent re-renders
const CategoryCard = React.memo(({ category, expenses, ... }) => {
  // Component code
});

const ExpenseItem = React.memo(({ expense, ... }) => {
  // Component code
});
```

## Error Handling

### Current Approach

- Form validation (required fields)
- Basic error boundaries (context provides data)

### Potential Additions

```javascript
// Add try-catch in async operations
try {
  await addExpense(categoryId, amount, description);
} catch (error) {
  toast.error(error.message);
}

// Add loading states
const [loading, setLoading] = useState(false);
```

## Accessibility

### Current Features

- Semantic HTML buttons
- Title attributes on buttons
- Clear labels for form inputs
- Keyboard navigation (buttons are clickable)

### Potential Improvements

```javascript
// Add ARIA labels
<button aria-label="Delete expense">
  <FiTrash2 />
</button>

// Add keyboard shortcuts
<input onKeyDown={(e) => {
  if (e.key === 'Escape') onClose();
}}/>
```

---

## Testing Components

### Unit Tests for useExpense

```javascript
describe("useExpense", () => {
  test("should add category", () => {
    // Test implementation
  });

  test("should delete expense", () => {
    // Test implementation
  });
});
```

### Integration Tests

```javascript
describe("ExpenseDashboard", () => {
  test("should render categories", () => {
    // Test implementation
  });

  test("should add category when form submitted", () => {
    // Test implementation
  });
});
```

---

This architecture provides:

- **Clear separation of concerns**
- **Reusable components**
- **Centralized state management**
- **Easy to extend and modify**
- **Good performance out of the box**
