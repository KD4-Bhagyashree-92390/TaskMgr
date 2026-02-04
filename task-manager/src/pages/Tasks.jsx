import { useEffect, useState, useCallback } from "react";
import { Button, Container, Typography, Box, Alert, Snackbar, CircularProgress, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import api from './../api/Axios';
import { useNavigate } from 'react-router';
import TaskForm from './../components/TaskForm';
import TaskItem from './../components/TaskItem';

/**
 * Tasks Page Component
 * Displays a list of tasks and provides functionality to add, edit, delete, and change status.
 */
function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const navigate = useNavigate();

    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    /**
     * Show notification message
     */
    const showMessage = useCallback((message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    }, []);

    /**
     * Fetch all tasks from backend
     */
    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await api.get("/tasks");
            setTasks(res.data);
        } catch (err) {
            console.error(err);
            showMessage("Failed to fetch tasks", "error");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle Submit (Create or Update)
     */
    const handleSubmit = async (taskData) => {
        // 🧹 Clean payload to match TaskRequest DTO
        const payload = {
            title: taskData.title,
            description: taskData.description,
            dueDate: taskData.dueDate,
            status: taskData.status || "TO_DO"
        };

        try {
            if (editingTask) {
                // UPDATE
                await api.put(`/tasks/${editingTask.id}`, payload);
                showMessage("Task updated successfully!");
                setEditingTask(null);
            } else {
                // CREATE
                await api.post("/tasks", payload);
                showMessage("Task created successfully!");
            }
            fetchTasks();
            setIsFormVisible(false);
        } catch (err) {
            console.error(err);
            showMessage("Action failed. Please try again.", "error");
        }
    };

    /**
     * Delete a task by ID
     */
    const deleteTask = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(task => task.id !== id));
            showMessage("Task deleted successfully!");
        } catch (err) {
            console.error(err);
            showMessage("Failed to delete task", "error");
        }
    };

    /**
     * Change task status
     * Consolidates status change into the general update endpoint
     */
    // 📦 Update handleStatusChange in Tasks.jsx

    // 🚀 src/pages/Tasks.jsx

    const handleStatusChange = async (id, newStatus) => {
        // 1. Keep a copy for rollback
        const originalTasks = [...tasks];

        // 2. Update UI instantly (Optimistic Update)
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));

        try {
            // 3. Call the dedicated status API
            // No need to send title/desc anymore!
            await api.put(`/tasks/${id}/status`, { status: newStatus });

            // Format the display name (e.g., "TODO" -> "To Do")
            const displayName = newStatus.replace('_', ' ').toLowerCase();
            showMessage(`Status changed to ${displayName}`);

        } catch (err) {
            console.error("Status Update Failed:", err);
            // 4. Rollback UI if backend fails
            setTasks(originalTasks);
            showMessage("Failed to update status on server", "error");
        }
    };

    /**
     * Set task for editing
     */
    const handleEdit = (task) => {
        setEditingTask(task);
        setIsFormVisible(true);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /**
     * Cancel form
     */
    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingTask(null);
    };

    /**
     * Logout user
     */
    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    Task Manager
                </Typography>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={logout}
                    startIcon={<LogoutIcon />}
                >
                    Logout
                </Button>
            </Box>

            {/* Action Bar */}
            {!isFormVisible && (
                <Box sx={{ mb: 4 }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={() => setIsFormVisible(true)}
                        sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                    >
                        Add New Task
                    </Button>
                </Box>
            )}

            {/* Task Creation/Editing Form */}
            {isFormVisible && (
                <TaskForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    initialData={editingTask}
                />
            )}

            {/* Tasks List */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    {tasks.length > 0 ? `Your Tasks (${tasks.length})` : "Task List"}
                </Typography>
                {loading && <CircularProgress size={20} />}
            </Box>

            <Box>
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onDelete={deleteTask}
                            onStatusChange={handleStatusChange}
                            onEdit={handleEdit}
                        />
                    ))
                ) : (
                    !loading && (
                        <Paper sx={{ textAlign: 'center', py: 8, bgcolor: '#f5f5f5', borderRadius: 4 }}>
                            <Typography color="text.secondary">
                                No tasks found. Click "Add New Task" to get started!
                            </Typography>
                        </Paper>
                    )
                )}
            </Box>

            {/* Notification Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default Tasks;