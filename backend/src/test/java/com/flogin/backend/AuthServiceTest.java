package com.flogin.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.flogin.backend.dto.auth.AuthResponse;
import com.flogin.backend.dto.auth.LoginRequest;
import com.flogin.backend.dto.auth.RegisterRequest;
import com.flogin.backend.entity.User;
import com.flogin.backend.service.AuthService;
import com.flogin.backend.service.JwtService;
import com.flogin.backend.service.UserService;

public class AuthServiceTest {
    private AuthService authService;

    @BeforeEach
    void setUp(){
       UserService userServiceFake = new UserService(null) {
                @Override
                public User findByUsername(String username) {
                    if ("testuser@example.com".equals(username)) {
                        return new User("testuser@example.com", "Test123", "John", "Doe");
                    }
                    return null;
                }


                    @Override
                public boolean existsByUsername(String username) {
                    return "existinguser".equals(username);
                }

                @Override
                public User save(User user) {
                    return user; // giả lập lưu thành công
                }
            };

              authService = new AuthService(
            userServiceFake,
            new PasswordEncoder() {
                @Override
                public String encode(CharSequence rawPassword) { return rawPassword.toString(); }
                @Override
                public boolean matches(CharSequence rawPassword, String encodedPassword) {
                    return rawPassword.toString().equals(encodedPassword);
                }
            },// test ko can hash 
            new JwtService() {
                @Override
                public String generateToken(String username, String role) { return "fake-token"; }
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
        Exception exception = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("Xác thực ko hợp lệ: user ko tồn tại", exception.getMessage());
    }

    @Test
    @DisplayName("TC3: Login thất bại với password sai")
    void testLoginWrongPassword() {
        LoginRequest request = new LoginRequest("testuser@example.com", "WrongPass");
        Exception exception = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("Xác thực ko hợp lệ: sai mật khẩu", exception.getMessage());
    }

    @Test
    @DisplayName("TC4: User name ''/null ")
    void testLoginUserNameEmpty() {
        LoginRequest request = new LoginRequest("", "Test123");
        Exception ex = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("Username không được để trống", ex.getMessage());
    }

    @Test
    @DisplayName("TC5: Password ''/null ")
    void testLoginPasswordNull() {
        LoginRequest request = new LoginRequest("testuser@example.com", null);
        Exception ex = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("Password không được để trống", ex.getMessage());
    }

    @Test
    @DisplayName("TC6: Register thành công")
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest(
            "newuser",   
            "Test123",    
            "John",       
            "Doe"         
        );
        AuthResponse response = authService.register(request);
        assertEquals("Đăng kí thành công", response.getMessage());
        assertNotNull(response.getToken());
    }

    @Test
    @DisplayName("TC7: Register thất bại khi username đã tồn tại")
    void testRegisterUserExist() {
        RegisterRequest request = new RegisterRequest(
            "existinguser",
            "Test123",
            "John",
            "Doe"
        );
        Exception ex = assertThrows(RuntimeException.class, () -> authService.register(request));
        assertTrue(ex.getMessage().contains("Email đã tồn tại!!!!"));
    }

    @Test
    @DisplayName("TC8: Register username rỗng")
    void testRegisterUsernameEmpty() {
        RegisterRequest request = new RegisterRequest(
            "",
            "Test123",
            "John",
            "Doe"
        );
        Exception ex = assertThrows(RuntimeException.class, () -> authService.register(request));
        assertEquals("Username không được để trống", ex.getMessage());
    }

    @Test
    @DisplayName("TC9: Register password rỗng/null")
    void testRegisterPasswordEmpty() {
        RegisterRequest request = new RegisterRequest(
            "newuser",
            "",
            "John",
            "Doe"
        );
        Exception ex = assertThrows(RuntimeException.class, () -> authService.register(request));
        assertEquals("Password không được để trống", ex.getMessage());
    }

    @Test
    @DisplayName("TC10: Register firstName rỗng")
    void testRegisterFirstNameEmpty() {
        RegisterRequest request = new RegisterRequest(
            "newuser",
            "Test123",
            "",
            "Doe"
        );
        Exception ex = assertThrows(RuntimeException.class, () -> authService.register(request));
        assertEquals("First name không được để trống", ex.getMessage());
    }

    @Test
    @DisplayName("TC11: Register lastName rỗng")
    void testRegisterLastNameEmpty() {
        RegisterRequest request = new RegisterRequest(
            "newuser",
            "Test123",
            "John",
            ""
        );
        Exception ex = assertThrows(RuntimeException.class, () -> authService.register(request));
        assertEquals("Last name không được để trống", ex.getMessage());
    }

}
