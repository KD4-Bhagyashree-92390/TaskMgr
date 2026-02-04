package com.backend.services;

import com.backend.entities.User;

public interface UserService {

    User registerUser(String email, String password);

    User findByEmail(String email);
}