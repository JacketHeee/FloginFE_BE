package com.flogin.backend.mock;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.ArgumentMatchers.any;

import com.flogin.backend.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.flogin.backend.controller.AuthController;
import com.flogin.backend.dto.auth.AuthResponse;
import com.flogin.backend.dto.auth.LoginRequest;
import com.flogin.backend.dto.auth.RegisterRequest;
import com.flogin.backend.service.AuthService;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters=false)
public class AuthControllerMockTest {
    
    @Autowired
    private MockMvc mockMvc; //mo phong http req/res

    @MockitoBean
    private AuthService authService; //mock object gia lap inject vao moi khi goi http 

    @Test
    @DisplayName("Login thành công với mocked service")
    void testLoginWithMockedService() throws Exception {
        AuthResponse mockResponse =  new AuthResponse(true,"Success", "mock-token",new User());

        when(authService.login(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser@example.com\",\"password\":\"Pass123\"}"))
                .andExpect(status().isOk());


        verify(authService, times(1)).login(any(LoginRequest.class));// kiem tra so lan ham dc goi


    }

    @Test
    @DisplayName("Register thành công với mocked service")
    void testRegisterWithMockedService() throws Exception {
        AuthResponse mockResponse = new AuthResponse( true,"Registered", "mock-token",new User());

        when(authService.register(any(RegisterRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"newuser@example.com\",\"password\":\"Pass123\",\"firstName\":\"John\",\"lastName\":\"Doe\"}"))
                .andExpect(status().isOk());

        verify(authService, times(1)).register(any(RegisterRequest.class));
    }


}
