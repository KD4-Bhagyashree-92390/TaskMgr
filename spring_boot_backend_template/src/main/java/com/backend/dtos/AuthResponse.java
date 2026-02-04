package com.backend.dtos;

import lombok.*;

@Getter @Setter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String role;
}