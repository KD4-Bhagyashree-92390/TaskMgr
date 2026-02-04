package com.backend.dtos;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class TaskRequest {

    private String title;
    private String description;     
    private LocalDate dueDate;    
}