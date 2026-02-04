package com.backend.controller;

import com.backend.dtos.TaskRequest;
import com.backend.dtos.TaskResponse;
import com.backend.services.TaskService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public TaskResponse create(@RequestBody TaskRequest request) {
        return taskService.createTask(request);
    }

    @GetMapping
    public List<TaskResponse> myTasks() {
        return taskService.getMyTasks();
    }

    @PutMapping("/{id}")
    public TaskResponse update(
            @PathVariable Long id,
            @RequestBody TaskRequest request) {
        return taskService.updateTask(id, request);
    }

 // 🚀 Add this to TaskController.java

    @PutMapping("/{id}/status")
    public TaskResponse updateStatus(
            @PathVariable Long id, 
            @RequestBody java.util.Map<String, String> request) {
        String newStatus = request.get("status");
        return taskService.updateTaskStatus(id, newStatus);
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}