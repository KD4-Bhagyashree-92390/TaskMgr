import { Button, Typography, Paper, Box, Chip, Menu, MenuItem, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useState } from "react";

/**
 * TaskItem Component
 * Renders a single task with options to change status, edit, and delete.
 * 
 * @param {Object} props
 * @param {Object} props.task - The task object
 * @param {Function} props.onDelete - Callback for deleting a task
 * @param {Function} props.onStatusChange - Callback for changing task status
 * @param {Function} props.onEdit - Callback for editing a task
 */
function TaskItem({ task, onDelete, onStatusChange, onEdit }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleStatusClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleStatusClose = () => {
        setAnchorEl(null);
    };

    const handleStatusSelect = (newStatus) => {
        onStatusChange(task.id, newStatus);
        handleStatusClose();
    };

    // Define colors and icons based on status
    // 🚀 src/components/TaskItem.jsx (Inside getStatusConfig)

const getStatusConfig = (status) => {
    switch (status) {
        case "DONE":
            return { color: "success", icon: <CheckCircleIcon />, label: "Done", border: "#4caf50" };
        case "IN_PROGRESS":
            return { color: "info", icon: <AutorenewIcon />, label: "In Progress", border: "#0288d1" };
        case "TODO": // Changed from "TO_DO" to "TODO"
        default:
            return { color: "warning", icon: <PendingActionsIcon />, label: "To Do", border: "#ff9800" };
    }
};

    const config = getStatusConfig(task.status);

    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderLeft: `5px solid ${config.border}`,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4
                }
            }}
        >
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {task.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    {task.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Tooltip title="Click to change status">
                        <Chip
                            label={config.label}
                            size="small"
                            color={config.color}
                            icon={config.icon}
                            onClick={handleStatusClick}
                            sx={{ cursor: 'pointer' }}
                        />
                    </Tooltip>

                   

                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleStatusClose}
                    >
                        {/* Use "TODO" to match TaskStatus.TODO in your backend */}
                        <MenuItem onClick={() => handleStatusSelect("TODO")} disabled={task.status === "TODO"}>
                            To Do
    </MenuItem>

                        <MenuItem onClick={() => handleStatusSelect("IN_PROGRESS")} disabled={task.status === "IN_PROGRESS"}>
                            In Progress
    </MenuItem>

                        <MenuItem onClick={() => handleStatusSelect("DONE")} disabled={task.status === "DONE"}>
                            Done
    </MenuItem>
                    </Menu>

                    {task.dueDate && (
                        <Typography variant="caption" color="text.secondary">
                            Due: {task.dueDate}
                        </Typography>
                    )}
                </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
                <Tooltip title="Edit Task">
                    <IconButton
                        color="primary"
                        onClick={() => onEdit(task)}
                        size="small"
                        sx={{ border: '1px solid #ccc' }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Delete Task">
                    <IconButton
                        color="error"
                        onClick={() => onDelete(task.id)}
                        size="small"
                        sx={{ border: '1px solid #ff1744' }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Paper>
    );
}

export default TaskItem;
