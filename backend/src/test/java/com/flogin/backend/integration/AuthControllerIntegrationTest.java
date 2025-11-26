package com.flogin.backend.integration;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.backend.controller.AuthController;
import com.flogin.backend.dto.auth.AuthResponse;
import com.flogin.backend.dto.auth.LoginRequest;
import com.flogin.backend.entity.User;
import com.flogin.backend.service.AuthService;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = true)
@DisplayName("Login API Integration Tests")
@CrossOrigin(origins = "*")
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    @TestConfiguration
    static class TestSecurityConfig {
        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            http
                    .csrf(csrf -> csrf.disable()) // Tắt CSRF để test POST
                    .authorizeHttpRequests(auth -> auth
                            .anyRequest().permitAll() // Cho phép TẤT CẢ các request đi qua (để test CORS)
                    );
            return http.build();
        }
    }

    @Test
    @DisplayName("Post /api/auth/login - Thanh cong")
    void testLoginSuccess() throws Exception {
        LoginRequest loginRequest = new LoginRequest("L0ngkute", "123");

        AuthResponse mockResponse = new AuthResponse(
                true,
                "Dang nhap thanh cong", "Token123", new User(1L, "L0ngkute"));
        when(authService.login(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(true))
                .andExpect(jsonPath("$.message").value("Dang nhap thanh cong"))
                .andExpect(jsonPath("$.token").exists());
    }

    @Test
    @DisplayName("POST /api/auth/login - That bai do sai password")
    void testLoginFailure_WrongPassword() throws Exception {
        // 1. Arrange (Chuẩn bị dữ liệu sai)
        LoginRequest request = new LoginRequest("L0ngkute", "saiPassNe");

        AuthResponse failResponse = new AuthResponse(
                false,
                "Invalid username or password",
                null,
                null);

        when(authService.login(any(LoginRequest.class)))
                .thenReturn(failResponse);

        // 2. Act (Thực hiện)
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                // 3. Assert (Kiểm tra)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(false))
                .andExpect(jsonPath("$.message").value("Invalid username or password"))
                .andExpect(jsonPath("$.token").doesNotExist()); // Đảm bảo không có token
    }

    @Test
    @DisplayName("Post /api/auth/login - Loi Validation (Username rong)")
    void testLoginFailure_EmptyUsername() throws Exception {
        LoginRequest loginRequest = new LoginRequest("", "longkute123");

        // ko can Mock vi da validate o FE

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsBytes(loginRequest)))
                .andExpect(status().isBadRequest());

        // Đảm bảo authService 0 chạy
        verify(authService, times(0)).login(any());
    }

    @Test
    @DisplayName("Check Structure: Login Success (200 OK + Full JSON)")
    void testLoginResponseStructure_Success() throws Exception {
        // --- 1. ARRANGE (Chuẩn bị) ---
        LoginRequest request = new LoginRequest("L0ngkute", "hihihi");

        // Tạo Mock Response đầy đủ dữ liệu
        User userDto = new User(1L, "L0ngkute");
        AuthResponse successResponse = new AuthResponse(
                true,
                "Login successful",
                "ey.jwt.token.here", // token giả
                userDto);

        when(authService.login(any(LoginRequest.class)))
                .thenReturn(successResponse);

        // --- 2 & 3. ACT & ASSERT (Thực hiện & Kiểm tra) ---
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))

                // A. Kiểm tra HTTP Status Code
                .andExpect(status().isOk()) // Mong đợi mã 200

                // B. Kiểm tra Response Structure (Cấu trúc JSON)
                // Kiểm tra các trường bắt buộc phải có
                .andExpect(jsonPath("$.status").value(true)) // Field 'status' là true
                .andExpect(jsonPath("$.message").isString()) // Field 'message' phải là chuỗi
                .andExpect(jsonPath("$.token").isNotEmpty()) // Field 'token' không được rỗng

                // C. Kiểm tra cấu trúc lồng nhau (Nested Object: User)
                .andExpect(jsonPath("$.user").exists()) // Phải có object user
                .andExpect(jsonPath("$.user.id").value(1)) // Check ID
                .andExpect(jsonPath("$.user.username").value("L0ngkute"))

                // D. SECURITY CHECK (Cực kỳ quan trọng cho điểm Bonus)
                // Đảm bảo password KHÔNG được trả về trong JSON
                .andExpect(jsonPath("$.user.password").doesNotExist());
    }

    @Test
    @DisplayName("Check Structure: Validation Error (400 Bad Request)")
    void testLoginResponseStructure_Failure() throws Exception {
        LoginRequest loginRequest = new LoginRequest("", "hihihi");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))

                .andExpect(status().isBadRequest())
                .andDo(print());
    }

    @Test
    @DisplayName("Check CORS and Headers configuration")
    void testCorsAndHeaders() throws Exception {

        // Giả lập một request từ Frontend (React chạy ở localhost:3000)
        mockMvc.perform(options("/api/auth/login")
                .header("Access-Control-Request-Method", "POST")
                .header("Origin", "http://localhost:5173")) // Giả vờ mình là React

                // --- ASSERT (Kiểm tra) ---
                .andDo(print())
                .andExpect(status().isOk())

                // Kiểm tra CORS Headers (Cho phép kết nối từ nguồn khác)
                .andExpect(header().exists("Access-Control-Allow-Origin"))
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(header().exists("Access-Control-Allow-Methods"))
                .andExpect(header().string("Access-Control-Allow-Credentials", "true"));
    }

    @Test
    @DisplayName("Check Content-Type Header")
    void testContentTypeHeader() throws Exception {
        LoginRequest request = new LoginRequest("L0ngkute", "hihihi123");

        // Mock service trả về thành công (để lấy response header thực tế)
        when(authService.login(any())).thenReturn(new AuthResponse(true, "OK", "token", new User()));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))

                // 2. Kiểm tra Header chuẩn JSON
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "application/json"));
    }

}
