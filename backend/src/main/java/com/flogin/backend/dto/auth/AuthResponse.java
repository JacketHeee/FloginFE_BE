package com.flogin.backend.dto.auth;

import com.flogin.backend.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private boolean status;
    private String message;
    private String token;
    private User user;
}
