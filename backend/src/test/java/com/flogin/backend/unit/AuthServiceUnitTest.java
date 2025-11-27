package com.flogin.backend.unit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import com.flogin.backend.dto.auth.AuthResponse;
import com.flogin.backend.dto.auth.LoginRequest;
import com.flogin.backend.dto.auth.RegisterRequest;
import com.flogin.backend.entity.User;
import com.flogin.backend.service.AuthService;
import com.flogin.backend.service.JwtService;
import com.flogin.backend.service.UserService;

public class AuthServiceUnitTest {

    private AuthService authService;

    @BeforeEach
    void setUp() {

        //tao gia du lieu va ham de test

        UserService userServiceFake = new UserService(null) {

            @Override
            public User findByUsername(String username) {
                if ("testuser@example.com".equals(username)) {
                    User u = new User();
                    u.setUsername("testuser@example.com");
                    u.setPasswordHash("Test123");
                    u.setRole("USER");
                    return u;
                }
                return null;
            }

            @Override
            public boolean existsByUsername(String username) {
                return "existinguser".equals(username);
            }

            @Override
            public User save(User user) {
                return user;
            }
        };

        authService = new AuthService(
            userServiceFake,
            new PasswordEncoder() {
                @Override
                public String encode(CharSequence rawPassword) {
                    return rawPassword.toString();
                }
                @Override
                public boolean matches(CharSequence rawPassword, String encodedPassword) {
                    return rawPassword.toString().equals(encodedPassword);
                }
            },
            new JwtService() {
                @Override
                public String generateToken(String username, String role) {
                    return "fake-token";
                }
            }
        );
    }

    @Test
    @DisplayName("TC1: Login thành công với credentials hợp lệ")
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("testuser@example.com", "Test123");
        AuthResponse response = authService.login(request);

        assertEquals("Đăng nhập thành công", response.getMessage());
        assertNotNull(response.getToken());
    }

    @Test
    @DisplayName("TC2: Login thất bại với username không tồn tại")
    void testLoginUserNotExist() {
        LoginRequest request = new LoginRequest("wronguser@example.com", "Test123");

        BadCredentialsException ex =
                assertThrows(BadCredentialsException.class, () -> authService.login(request));

        assertEquals("Xác thực ko hợp lệ: user ko tồn tại", ex.getMessage());
    }

    @Test
    @DisplayName("TC3: Login thất bại với password sai")
    void testLoginWrongPassword() {
        LoginRequest request = new LoginRequest("testuser@example.com", "WrongPass");

        BadCredentialsException ex =
                assertThrows(BadCredentialsException.class, () -> authService.login(request));

        assertEquals("Xác thực ko hợp lệ: sai mật khẩu", ex.getMessage());
    }

    @Test
    @DisplayName("TC4: Username rỗng/null")
    void testLoginUserNameEmptyOrNull() {
        LoginRequest blank = new LoginRequest("", "Test123");
        BadCredentialsException ex1 =
                assertThrows(BadCredentialsException.class, () -> authService.login(blank));
        assertEquals("Username không được để trống", ex1.getMessage());

        LoginRequest nullUser = new LoginRequest(null, "Test123");
        BadCredentialsException ex2 =
                assertThrows(BadCredentialsException.class, () -> authService.login(nullUser));
        assertEquals("Username không được để trống", ex2.getMessage());
    }

    @Test
    @DisplayName("TC5: Password rỗng/null")
    void testLoginPasswordEmptyOrNull() {
        LoginRequest blank = new LoginRequest("testuser@example.com", "");
        BadCredentialsException ex1 =
                assertThrows(BadCredentialsException.class, () -> authService.login(blank));
        assertEquals("Password không được để trống", ex1.getMessage());

        LoginRequest nullPass = new LoginRequest("testuser@example.com", null);
        BadCredentialsException ex2 =
                assertThrows(BadCredentialsException.class, () -> authService.login(nullPass));
        assertEquals("Password không được để trống", ex2.getMessage());
    }

  
    @Test
    @DisplayName("TC6: Register thành công")
    void testRegisterSuccess() {
        RegisterRequest req = new RegisterRequest("newuser", "Test123", "John", "Doe");
        AuthResponse res = authService.register(req);

        assertEquals("Đăng kí thành công", res.getMessage());
        assertNotNull(res.getToken());
    }

    @Test
    @DisplayName("TC7: Register thất bại khi username đã tồn tại")
    void testRegisterUserExist() {
        RegisterRequest req =
                new RegisterRequest("existinguser", "Test123", "John", "Doe");

        ResponseStatusException ex =
                assertThrows(ResponseStatusException.class, () -> authService.register(req));

        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
        assertEquals("Username đã tồn tại!!!!", ex.getReason());
    }

    @Test
    @DisplayName("TC8: Register username rỗng/null")
    void testRegisterUsernameEmpty() {
        RegisterRequest blank =
                new RegisterRequest("", "Test123", "John", "Doe");
        Exception ex1 = assertThrows(BadCredentialsException.class, () -> authService.register(blank));
        assertEquals("Username không được để trống", ex1.getMessage());

        RegisterRequest nullUser =
                new RegisterRequest(null, "Test123", "John", "Doe");
        Exception ex2 = assertThrows(BadCredentialsException.class, () -> authService.register(nullUser));
        assertEquals("Username không được để trống", ex2.getMessage());
    }

    @Test
    @DisplayName("TC9: Register password rỗng/null")
    void testRegisterPasswordEmptyOrNull() {
        RegisterRequest blank =
                new RegisterRequest("newuser", "", "John", "Doe");
        Exception ex1 = assertThrows(BadCredentialsException.class, () -> authService.register(blank));
        assertEquals("Password không được để trống", ex1.getMessage());

        RegisterRequest nullPass =
                new RegisterRequest("newuser", null, "John", "Doe");
        Exception ex2 = assertThrows(BadCredentialsException.class, () -> authService.register(nullPass));
        assertEquals("Password không được để trống", ex2.getMessage());
    }

    @Test
    @DisplayName("TC10: Register firstName rỗng/null")
    void testRegisterFirstNameEmpty() {
        RegisterRequest blank =
                new RegisterRequest("newuser", "Test123", "", "Doe");
        Exception ex1 = assertThrows(BadCredentialsException.class, () -> authService.register(blank));
        assertEquals("First name không được để trống", ex1.getMessage());

        RegisterRequest nullFN =
                new RegisterRequest("newuser", "Test123", null, "Doe");
        Exception ex2 = assertThrows(BadCredentialsException.class, () -> authService.register(nullFN));
        assertEquals("First name không được để trống", ex2.getMessage());
    }

    @Test
    @DisplayName("TC11: Register lastName rỗng/null")
    void testRegisterLastNameEmpty() {
        RegisterRequest blank =
                new RegisterRequest("newuser", "Test123", "John", "");
        Exception ex1 = assertThrows(BadCredentialsException.class, () -> authService.register(blank));
        assertEquals("Last name không được để trống", ex1.getMessage());

        RegisterRequest nullLN =
                new RegisterRequest("newuser", "Test123", "John", null);
        Exception ex2 = assertThrows(BadCredentialsException.class, () -> authService.register(nullLN));
        assertEquals("Last name không được để trống", ex2.getMessage());
    }
}
