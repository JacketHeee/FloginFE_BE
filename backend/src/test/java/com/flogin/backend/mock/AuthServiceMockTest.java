package com.flogin.backend.mock;

import com.flogin.backend.dto.auth.AuthResponse;
import com.flogin.backend.dto.auth.LoginRequest;
import com.flogin.backend.dto.auth.RegisterRequest;
import com.flogin.backend.entity.User;
import com.flogin.backend.service.AuthService;
import com.flogin.backend.service.JwtService;
import com.flogin.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AuthServiceMockTest {

    @Mock
    private UserService userService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testUser = new User();
        testUser.setUsername("testUser");
        testUser.setPasswordHash("passwordEncoded");
        testUser.setRole("USER");
    }

    // ------------- Happy Path -------------------
    @Test
    @DisplayName("TC1: Đăng nhập thành công với credentials hợp lệ")
    void loginSuccess() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testUser");
        loginRequest.setPassword("testPassword");

        when(userService.findByUsername("testUser")).thenReturn(testUser);
        when(passwordEncoder.matches("testPassword", "passwordEncoded")).thenReturn(true);
        when(jwtService.generateToken("testUser", "USER")).thenReturn("mockToken");

        AuthResponse authResponse = authService.login(loginRequest);

        assertNotNull(authResponse);
        assertEquals("Đăng nhập thành công", authResponse.getMessage());
        assertEquals("mockToken", authResponse.getToken());

        verify(userService, times(1)).findByUsername("testUser");
        verify(passwordEncoder, times(1)).matches("testPassword", "passwordEncoded");
        verify(jwtService, times(1)).generateToken("testUser", "USER");
    }

    @Test
    @DisplayName("TC2: Đăng kí thành công với credentials hợp lệ")
    void registerSuccess() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("registerUser");
        registerRequest.setPassword("testPassword");


        when(userService.existsByUsername("registerUser")).thenReturn(false);


        when(passwordEncoder.encode("testPassword")).thenReturn("encodedPassword");


        User savedUser = new User();
        savedUser.setUsername("registerUser");
        savedUser.setPasswordHash("encodedPassword");
        savedUser.setRole("USER");

        when(userService.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken("registerUser", "USER"))
                .thenReturn("mockToken");


        AuthResponse authResponse = authService.register(registerRequest);


        assertNotNull(authResponse);
        assertEquals("Đăng kí thành công", authResponse.getMessage());
        assertEquals("mockToken", authResponse.getToken());


        verify(userService).existsByUsername("registerUser");
        verify(passwordEncoder).encode("testPassword");
        verify(userService).save(any(User.class));
        verify(jwtService).generateToken("registerUser", "USER");
    }


    //------------ Negative tests ----------------------
    @Test
    @DisplayName("TC3: Đăng nhập không thành công do username không tồn tại")
    void loginButUserNotFound() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("null");
        loginRequest.setPassword("12345");

        when(userService.findByUsername("null")).thenReturn(null);

        BadCredentialsException exception = assertThrows(BadCredentialsException.class, () -> authService.login(loginRequest));

        assertEquals("Xác thực ko hợp lệ: user ko tồn tại", exception.getMessage());

        verify(userService, times(1)).findByUsername("null");
        verifyNoInteractions(passwordEncoder);
        verifyNoInteractions(jwtService);
    }

    @Test
    @DisplayName("TC4: Đăng kí không thành công do username đã tồn tại")
    void registerButUsernameExist() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setFirstName("test");
        registerRequest.setLastName("user");
        registerRequest.setUsername("registerUser");
        registerRequest.setPassword("testPassword");

        when(userService.existsByUsername("registerUser")).thenReturn(true);

        ResponseStatusException responseStatusException = assertThrows(ResponseStatusException.class, () -> authService.register(registerRequest));

        assertTrue(responseStatusException.getMessage().contains("Username đã tồn tại"));

        verify(userService, times(1)).existsByUsername("registerUser");

    }

    @Test
    @DisplayName("TC5: Đăng nhập không thành công do sai mật khẩu")
    void loginButWrongPassword() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testUser");
        loginRequest.setPassword("wrongPassword");

        when(userService.findByUsername("testUser")).thenReturn(testUser);
        when(passwordEncoder.matches("wrongPassword", "passwordEncoded")).thenReturn(false);

        BadCredentialsException exception = assertThrows(BadCredentialsException.class, () -> authService.login(loginRequest));

        assertEquals("Xác thực ko hợp lệ: sai mật khẩu", exception.getMessage());

        verify(userService, times(1)).findByUsername("testUser");
        verify(passwordEncoder, times(1)).matches("wrongPassword", "passwordEncoded");
        verifyNoInteractions(jwtService);
    }

    //     ------------------- Validation / Edge Cases ----------------------
    @Test
    @DisplayName("TC6: Đăng nhập không thành công do username or password null")
    void loginButUsernameOrPasswordNull() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(null);
        loginRequest.setPassword(null);

        BadCredentialsException exception = assertThrows(
                BadCredentialsException.class,
                () -> authService.login(loginRequest)
            );
        assertEquals("Xác thực ko hợp lệ: username hoặc mật khẩu null", exception.getMessage());
    }

    @Test
    void registerButUsernameOrPasswordNull() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setFirstName("test");
        registerRequest.setLastName("user");
        registerRequest.setUsername(null);
        registerRequest.setPassword(null);

        BadCredentialsException exception = assertThrows(
                BadCredentialsException.class,
                () -> authService.register(registerRequest)
        );
        assertEquals("Xác thực ko hợp lệ: username hoặc mật khẩu null", exception.getMessage());
    }

}
