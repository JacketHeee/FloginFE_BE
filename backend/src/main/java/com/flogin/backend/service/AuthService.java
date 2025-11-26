package com.flogin.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.flogin.backend.dto.auth.AuthResponse;
import com.flogin.backend.dto.auth.LoginRequest;
import com.flogin.backend.dto.auth.RegisterRequest;
import com.flogin.backend.entity.User;

@Service
public class AuthService {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    public AuthService(UserService userService,PasswordEncoder passwordEncoder,JwtService jwtService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        if (registerRequest.getUsername() == null || registerRequest.getUsername().isBlank()) {
            throw new BadCredentialsException("Username không được để trống");
        }
        if (registerRequest.getPassword() == null || registerRequest.getPassword().isBlank()) {
            throw new BadCredentialsException("Password không được để trống");
        }
        if (registerRequest.getFirstName() == null || registerRequest.getFirstName().isBlank()) {
        throw new BadCredentialsException("First name không được để trống");
        }
        if (registerRequest.getLastName() == null || registerRequest.getLastName().isBlank()) {
            throw new BadCredentialsException("Last name không được để trống");
        }

        if(userService.existsByUsername(registerRequest.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username đã tồn tại!!!!");
        }
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole("USER");

        user = userService.save(user);

        String token = jwtService.generateToken(user.getUsername(),user.getRole());
        return new AuthResponse(true,"Đăng kí thành công",token,user);
    }

    public AuthResponse login(LoginRequest loginRequest) {

         if (loginRequest.getUsername() == null || loginRequest.getUsername().isBlank()) {
            throw new BadCredentialsException("Username không được để trống");
        }
        if (loginRequest.getPassword() == null || loginRequest.getPassword().isBlank()) {
            throw new BadCredentialsException("Password không được để trống");
        }
        User user = userService.findByUsername(loginRequest.getUsername());
        if(user == null) {
            throw new BadCredentialsException("Xác thực ko hợp lệ: user ko tồn tại");
        }
        if(!passwordEncoder.matches(loginRequest.getPassword(),user.getPasswordHash())) {
            throw new BadCredentialsException("Xác thực ko hợp lệ: sai mật khẩu");
        }
        String token = jwtService.generateToken(user.getUsername(),user.getRole());
        return new AuthResponse(true,"Đăng nhập thành công",token,user);
    }

}