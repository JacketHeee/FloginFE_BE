package com.flogin.backend.service;

import com.flogin.backend.dto.AuthResponse;
import com.flogin.backend.dto.LoginRequest;
import com.flogin.backend.dto.RegisterRequest;
import com.flogin.backend.entity.User;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserService userService;

    public AuthService(UserService userService) {
        this.userService = userService;
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        if(userService.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Emails is Exists");
        }
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPasswordHash(registerRequest.getPassword());
        user.setRole("USER");

        user = userService.save(user);

        if(userService.findByEmail(user.getEmail()) == null) {
            return new AuthResponse("Register invalid");
        }
        return new AuthResponse("Register successful");
    }

    public AuthResponse login(LoginRequest loginRequest) {
        User user = userService.findByEmail(loginRequest.getEmail());
        if(user == null) {
            throw new RuntimeException("User is not exists");
        }
        return new AuthResponse("Login Successful");
    }

}
