package com.backend.controller;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.backend.dtos.AuthResponse;
import com.backend.dtos.LoginRequest;
import com.backend.dtos.RegisterRequest;
import com.backend.entities.User;
import com.backend.security.JwtUtil;
import com.backend.services.UserService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(JwtUtil jwtUtil,
                          UserService userService,
                          PasswordEncoder passwordEncoder) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {

        userService.registerUser(
                request.getEmail(),
                request.getPassword()
        );

        return "User registered successfully";
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {

        User user = userService.findByEmail(request.getEmail());

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        String role=user.getRole().name();

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        
        return new AuthResponse(token,role);
    }
}