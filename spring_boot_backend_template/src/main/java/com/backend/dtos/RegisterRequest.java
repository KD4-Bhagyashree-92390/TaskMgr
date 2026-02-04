package com.backend.dtos;

import lombok.*;

@Getter @Setter
public class RegisterRequest {
    private String email;
    private String password;
}
