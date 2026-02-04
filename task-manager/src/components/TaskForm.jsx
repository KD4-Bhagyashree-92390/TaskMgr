import { TextField, Button, Box, Typography, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

/**
 * TaskForm Component
 * A form to create or update tasks.
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback when form is submitted
 * @param {Function} props.onCancel - Callback when cancel button is clicked
 * @param {Object} props.initialData - Data to pre-fill the form (for editing)
 */
function TaskForm({ onSubmit, onCancel, initialData }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);

  // Pre-fill form if initialData is provided (Edit Mode)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setDueDate(initialData.dueDate ? dayjs(initialData.dueDate) : null);
    } else {
      // Clear form if initialData becomes null (e.g., after an edit submission)
      setTitle("");
      setDescription("");
      setDueDate(null);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required!");
      return;
    }

    const taskData = {
      ...initialData, // Keep ID and other fields if editing
      title,
      description,
      dueDate: dueDate ? dueDate.format("YYYY-MM-DD") : null
    };

    onSubmit(taskData);

    // Clear form after submission (handled by useEffect if initialData is cleared by parent)
    // If initialData is not cleared by parent, we might want to clear here for new task creation flow
    // For now, relying on parent to manage initialData prop for clearing.
    // If this form is used for "create new" after an edit, initialData should be set to null by parent.
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          bg: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          mb: 4,
          backgroundColor: '#fff',
          border: initialData ? '2px solid #1976d2' : 'none'
        }}
      >
        <Typography variant="h5" sx={{ mb: 3 }}>
          {initialData ? "Edit Task" : "Add New Task"}
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Task Title"
            fullWidth
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <DatePicker
            label="Due Date"
            value={dueDate}
            disablePast
            onChange={(newValue) => setDueDate(newValue)}
            slotProps={{ textField: { fullWidth: true } }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" color="inherit" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" color="primary">
              {initialData ? "Update Task" : "Create Task"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}

export default TaskForm;