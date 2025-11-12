package com.flogin.backend.service;

import com.flogin.backend.dto.auth.AuthResponse;
import com.flogin.backend.dto.auth.LoginRequest;
import com.flogin.backend.dto.auth.RegisterRequest;
import com.flogin.backend.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
        if(userService.existsByUsername(registerRequest.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã tồn tại!!!!");
        }
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole("USER");

        user = userService.save(user);

        String token = jwtService.generateToken(user.getUsername(),user.getRole());
        return new AuthResponse("Đăng kí thành công",token);
    }

    public AuthResponse login(LoginRequest loginRequest) {
        User user = userService.findByUsername(loginRequest.getUsername());
        if(user == null) {
            throw new BadCredentialsException("Xác thực ko hợp lệ: user ko tồn tại");
        }
        if(!passwordEncoder.matches(loginRequest.getPassword(),user.getPasswordHash())) {
            throw new BadCredentialsException("Xác thực ko hợp lệ: sai mật khẩu");
        }
        String token = jwtService.generateToken(user.getUsername(),user.getRole());
        return new AuthResponse("Đăng nhập thành công",token);
    }

}
