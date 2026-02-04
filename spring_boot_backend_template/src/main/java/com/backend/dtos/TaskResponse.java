package com.backend.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private boolean completed;

    
}