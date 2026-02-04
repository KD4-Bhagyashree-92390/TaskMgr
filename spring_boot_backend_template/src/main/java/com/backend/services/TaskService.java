package com.backend.services;

import com.backend.dtos.TaskRequest;
import com.backend.dtos.TaskResponse;

import java.util.List;

public interface TaskService {

    TaskResponse createTask(TaskRequest request);
    List<TaskResponse> getMyTasks();
    TaskResponse updateTask(Long taskId, TaskRequest request);
    void deleteTask(Long taskId);
	TaskResponse updateTaskStatus(Long id, String newStatus);
}