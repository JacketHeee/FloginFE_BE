package com.flogin.backend.mock;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.ArgumentMatchers.any;
import static org.hamcrest.Matchers.nullValue;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.backend.controller.AuthController;
import com.flogin.backend.dto.auth.AuthResponse;
import com.flogin.backend.dto.auth.LoginRequest;
import com.flogin.backend.dto.auth.RegisterRequest;
import com.flogin.backend.entity.User;
import com.flogin.backend.service.AuthService;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerMockTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    // ======================== LOGIN ============================
    @Test
    @DisplayName("TC1: Login thành công")
    void testLoginSuccess() throws Exception {

        User fakeUser = new User();
        fakeUser.setId(1L);
        fakeUser.setUsername("testuser@example.com");
        fakeUser.setFirstName("John");
        fakeUser.setLastName("Doe");

        AuthResponse mockResponse =
            new AuthResponse(true, "Success", "mock-token", fakeUser);

        when(authService.login(any(LoginRequest.class))).thenReturn(mockResponse);

        LoginRequest req = new LoginRequest("testuser@example.com", "Pass123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(true))
                .andExpect(jsonPath("$.message").value("Success"))
                .andExpect(jsonPath("$.token").value("mock-token"))
                .andExpect(jsonPath("$.user.username").value("testuser@example.com"))
                .andExpect(jsonPath("$.user.firstName").value("John"))
                .andExpect(jsonPath("$.user.lastName").value("Doe"));

        verify(authService, times(1)).login(any(LoginRequest.class));
    }

    @Test
    @DisplayName("TC2: Login thất bại do sai mật khẩu")
    void testLoginFailWrongPassword() throws Exception {

        AuthResponse mockResponse =
            new AuthResponse(false, "Login Fail", null, null);

        when(authService.login(any(LoginRequest.class))).thenReturn(mockResponse);

        LoginRequest req = new LoginRequest("testuser@example.com", "wrongPass");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login Fail"))
                .andExpect(jsonPath("$.token").value(nullValue()));

        verify(authService, times(1)).login(any(LoginRequest.class));
    }

    @Test
    @DisplayName("TC3: Login thất bại username rỗng")
    void testLoginFailEmptyUsername() throws Exception {

        LoginRequest req = new LoginRequest("", "Pass123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC4: Login thất bại thiếu username")
    void testLoginFailMissingUsername() throws Exception {

        String body = """
        {
            "password": "Pass123"
        }
        """;

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC5: Login thất bại password rỗng")
    void testLoginFailEmptyPassword() throws Exception {

        LoginRequest req = new LoginRequest("test@example.com", "");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC6: Login thất bại thiếu password")
    void testLoginFailMissingPassword() throws Exception {

        String body = """
        {
            "username": "test@example.com"
        }
        """;

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isBadRequest());
    }

    // ======================== REGISTER ============================
    @Test
    @DisplayName("TC7: Register thành công")
    void testRegisterSuccess() throws Exception {

        User fakeUser = new User();
        fakeUser.setId(10L);
        fakeUser.setUsername("newuser@example.com");
        fakeUser.setFirstName("John");
        fakeUser.setLastName("Doe");

        AuthResponse mockResponse =
            new AuthResponse(true, "Registered", "mock-token", fakeUser);

        when(authService.register(any(RegisterRequest.class))).thenReturn(mockResponse);

        RegisterRequest req =
            new RegisterRequest("newuser@example.com", "Pass123", "John", "Doe");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                // writeValueAsString convert object Java thanh json String
                //{"username":"newuser@example.com","password":"Pass123","firstName":"John","lastName":"Doe"}
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Registered"))
                .andExpect(jsonPath("$.token").value("mock-token"))
                .andExpect(jsonPath("$.user.username").value("newuser@example.com"))
                .andExpect(jsonPath("$.user.firstName").value("John"))
                .andExpect(jsonPath("$.user.lastName").value("Doe"));

        verify(authService, times(1)).register(any(RegisterRequest.class));
    }

    @Test
    @DisplayName("TC8: Register thất bại username rỗng")
    void testRegisterFailEmptyUsername() throws Exception {

        RegisterRequest req =
            new RegisterRequest("", "Pass123", "John", "Doe");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC9: Register thất bại – thiếu username")
    void testRegisterFailMissingUsername() throws Exception {

        String body = """
        {
            "password":"Pass123",
            "firstName":"John",
            "lastName":"Doe"
        }
        """;

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC10: Register thất bại password rỗng")
    void testRegisterFailEmptyPassword() throws Exception {

        RegisterRequest req =
            new RegisterRequest("new@example.com", "", "John", "Doe");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC11: Register thất bại thiếu password")
    void testRegisterFailMissingPassword() throws Exception {

        String body = """
        {
            "username":"new@example.com",
            "firstName":"John",
            "lastName":"Doe"
        }
        """;

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC12: Register thất bại firstName rỗng")
    void testRegisterFailEmptyFirstName() throws Exception {

        RegisterRequest req =
            new RegisterRequest("new@example.com", "Pass123", "", "Doe");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC13: Register thất bại thiếu firstName")
    void testRegisterFailMissingFirstName() throws Exception {

        String body = """
        {
            "username":"new@example.com",
            "password":"Pass123",
            "lastName":"Doe"
        }
        """;

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC14: Register thất bại lastName rỗng")
    void testRegisterFailEmptyLastName() throws Exception {

        RegisterRequest req =
            new RegisterRequest("new@example.com", "Pass123", "John", "");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC15: Register thất bại thiếu lastName")
    void testRegisterFailMissingLastName() throws Exception {

        String body = """
        {
            "username":"new@example.com",
            "password":"Pass123",
            "firstName":"John"
        }
        """;

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isBadRequest());
    }
}
