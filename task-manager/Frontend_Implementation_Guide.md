# Task Manager Frontend: Step-by-Step Implementation Guide

This guide breaks down how the Task Manager frontend was built, explaining the architecture, logic, and component structure.

---

## 🚀 1. Architecture & Setup
The project is built using **React** (with Vite) and **Material UI (MUI)** for the design system.

### Key Technologies:
- **React Router**: For navigating between Login, Register, and Tasks.
- **Axios**: For making HTTP requests to the Spring Boot backend.
- **Material UI**: For pre-built, professional-looking components (Buttons, Cards, Menus).
- **Session Storage**: To store the JWT token and maintain the user session.

---

## 🔐 2. Authentication & Security
The app uses **JWT (JSON Web Token)** authentication.

### The Flow:
1. **Axios Interceptor (`api/Axios.js`)**:
   - This script automatically "intercepts" every outgoing request.
   - It grabs the `token` from `sessionStorage` and attaches it to the `Authorization` header.
   - This ensures the backend always knows who is making the request.

2. **Protected Routes (`routes/ProtectedRoute.jsx`)**:
   - A wrapper component that checks if a token exists.
   - If no token is found, it redirects the user to the `/login` page.
   - This prevents unauthorized users from seeing the `/tasks` page.

---

## 📝 3. User Registration & Login
These are the entry points to the application.

### login.jsx & Register.jsx:
- **State Management**: Uses `useState` to track the Email and Password fields.
- **Form Submission**: 
  - `handleLogin` calls `POST /auth/login`.
  - `handleRegister` calls `POST /auth/register`.
- **Navigation**: Once logged in, the `token` and `role` are saved, and the user is redirected to `/tasks` using `useNavigate`.

---

## 📋 4. The Task Management Dashboard (`Tasks.jsx`)
This is the "Brain" of the application. It handles the list of tasks and all major actions.

### Key Logic:
1. **Fetching Tasks**: When the page loads, `useEffect` triggers `fetchTasks()` which calls `GET /tasks`.
2. **Adding/Editing**:
   - One form (`TaskForm.jsx`) handles both **Adding** and **Editing**.
   - If an `editingTask` exists, the form pre-fills with that data and sends a `PUT` request.
3. **Optimistic Status Updates**:
   - When a user changes a status (e.g., to "Done"), the frontend updates the list **instantly** (`setTasks`) before the server even responds.
   - If the server fails, it "rolls back" to the previous state.

---

## 📦 5. Component Breakdown
Clean code strategy: **Parent handles Logic, Child handles Display.**

### `TaskItem.jsx`:
- Displays individual task details (Title, Description, Due Date).
- **Status Menu**: Uses MUI `Menu` and `MenuItem` to let users pick a status.
- **Colors**: A helper function `getStatusConfig` chooses the icon and color based on the status string (`TODO`, `IN_PROGRESS`, `DONE`).

### `TaskForm.jsx`:
- A reusable form component.
- Uses `DatePicker` from MUI for a professional calendar input.
- Dynamically changes its title ("Add" vs "Edit") based on whether `initialData` is passed to it.

---

## 🛠️ 6. API Integration Steps
The frontend communicates with these backend endpoints:
- `POST /auth/register`: Create a user.
- `POST /auth/login`: Get a token.
- `GET /tasks`: Fetch all tasks for the logged-in user.
- `POST /tasks`: Create a new task.
- `PUT /tasks/{id}`: Update task title/description.
- `PUT /tasks/{id}/status`: **Specialized endpoint** to change only the status.
- `DELETE /tasks/{id}`: Remove a task.

---

## 💡 Summary of Project Logic
1. **User enters**: Login or Register.
2. **App stores token**: Token is put in `sessionStorage`.
3. **App fetches data**: `Tasks.jsx` loads all tasks.
4. **User interacts**: Clicks Edit, Delete, or Change Status.
5. **Backend Syncs**: Every action updates the Spring Boot database.
6. **Instant Feedback**: Snackbar notifications show "Successful" or "Failed" messages for every action.

---

> [!TIP]
> **How to save as PDF:**
> Since this is a Markdown file, you can open it in your editor (like VS Code), right-click, and select **"Open Preview"**. From there, you can print the page or use a "Markdown to PDF" extension to save it permanently!
