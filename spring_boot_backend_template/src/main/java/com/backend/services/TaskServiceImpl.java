package com.backend.services;

import com.backend.dtos.TaskRequest;
import com.backend.dtos.TaskResponse;
import com.backend.entities.Task;
import com.backend.entities.TaskStatus;
import com.backend.entities.User;
import com.backend.exception.ResourceNotFoundException;
import com.backend.repository.TaskRepository;
import com.backend.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public TaskServiceImpl(TaskRepository taskRepository,
                           UserRepository userRepository,
                           ModelMapper modelMapper) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

    private User getLoggedInUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public TaskResponse createTask(TaskRequest request) {

        User user = getLoggedInUser();

        Task task = modelMapper.map(request, Task.class);
        task.setUser(user);
        task.setCompleted(false);
        task.setStatus(TaskStatus.TODO);
        return modelMapper.map(
                taskRepository.save(task),
                TaskResponse.class
        );
    }

    @Override
    public List<TaskResponse> getMyTasks() {

        User user = getLoggedInUser();

        return taskRepository.findByUser(user)
                .stream()
                .map(task -> modelMapper.map(task, TaskResponse.class))
                .toList();
    }

    @Override
    public TaskResponse updateTask(Long taskId, TaskRequest request) {

        User user = getLoggedInUser();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());

        return modelMapper.map(
                taskRepository.save(task),
                TaskResponse.class
        );
    }

    @Override
    public void deleteTask(Long taskId) {

        User user = getLoggedInUser();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        taskRepository.delete(task);
    }
    
 // 🚀 Add to TaskServiceImpl class

 // 🚀 Replace your updateTaskStatus in TaskServiceImpl.java with this:

    @Override
    @Transactional
    public TaskResponse updateTaskStatus(Long id, String status) {
        // 1. Get the current logged-in user
        User user = getLoggedInUser();

        // 2. Fetch the task (using your custom ResourceNotFoundException)
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        // 3. Security Check: Only the owner can update the status
        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: You do not own this task");
        }

        // 4. Convert the incoming String to the TaskStatus Enum 
        // .toUpperCase() handles case sensitivity, .replace("-", "_") handles "IN-PROGRESS" -> "IN_PROGRESS"
        try {
            TaskStatus newStatus = TaskStatus.valueOf(status.toUpperCase().replace(" ", "_"));
            task.setStatus(newStatus);
            task.setCompleted(newStatus == TaskStatus.DONE);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value: " + status);
        }

        // 5. Save and Map back to Response using your existing modelMapper
        Task updatedTask = taskRepository.save(task);
        return modelMapper.map(updatedTask, TaskResponse.class);
    }
}