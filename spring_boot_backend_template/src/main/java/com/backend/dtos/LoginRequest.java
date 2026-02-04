package com.backend.dtos;

import lombok.*;

@Getter @Setter
public class LoginRequest {
    private String email;
    private String password;
}