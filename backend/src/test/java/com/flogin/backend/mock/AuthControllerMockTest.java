package com.flogin.backend.mock;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.ArgumentMatchers.any;
import static org.hamcrest.Matchers.nullValue;


import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.flogin.backend.controller.AuthController;
import com.flogin.backend.dto.auth.AuthResponse;
import com.flogin.backend.dto.auth.LoginRequest;
import com.flogin.backend.dto.auth.RegisterRequest;
import com.flogin.backend.service.AuthService;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerMockTest {

    @Autowired
    private MockMvc mockMvc; // mo phong http req/res

    @MockBean
    private AuthService authService; // mock object gia lap inject vao moi khi goi http

    @Test
    @DisplayName("Login thành công")
    void testLoginWithMockedService() throws Exception {
        AuthResponse mockResponse = new AuthResponse("Success", "mock-token");

        when(authService.login(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser@example.com\",\"password\":\"Pass123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Success"))
                .andExpect(jsonPath("$.token").value("mock-token"));

        verify(authService, times(1)).login(any(LoginRequest.class));// kiem tra so lan ham dc goi
    }

    @Test
    @DisplayName("Login thất bại với sai mật khẩu")
    void testLoginFailWithMockedService() throws Exception {
        AuthResponse mockResponse = new AuthResponse("Login Fail", null);

        when(authService.login(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser@example.com\",\"password\":\"wrongPass\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login Fail"))
                .andExpect(jsonPath("$.token").value(nullValue()));

        verify(authService, times(1)).login(any(LoginRequest.class));// kiem tra so lan ham dc goi

    }

    @Test
    @DisplayName("Login thất bại với UserName rỗng")
    void testLoginFailEmptyUserNameWithMockedService() throws Exception {

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"\",\"password\":\"Pass123\"}"))
                .andExpect(status().isBadRequest());
               
    }

    @Test
    @DisplayName("Login thất bại với thiếu UserName")
    void testLoginFailMissUserNameWithMockedService() throws Exception {

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"password\":\"Pass123\"}"))
                .andExpect(status().isBadRequest());
          
    }

    @Test
    @DisplayName("Login thất bại với PassWord rỗng")
    void testLoginFailEmptyPassWordWithMockedService() throws Exception {

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser@example.com\",\"password\":\"\"}"))
                .andExpect(status().isBadRequest());
              
    }

    @Test
    @DisplayName("Login thất bại với thiếu PassWord")
    void testLoginFailMissPassWordWithMockedService() throws Exception {

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser@example.com\"}"))
                .andExpect(status().isBadRequest());
    }

    //-------------------------------------------------------------------------------------------------

    @Test
    @DisplayName("Register thành công")
    void testRegisterWithMockedService() throws Exception {
        AuthResponse mockResponse = new AuthResponse("Registered", "mock-token");

        when(authService.register(any(RegisterRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        "{\"username\":\"newuser@example.com\",\"password\":\"Pass123\",\"firstName\":\"John\",\"lastName\":\"Doe\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Registered"))
                .andExpect(jsonPath("$.token").value("mock-token"));

        verify(authService, times(1)).register(any(RegisterRequest.class));
    }

     @Test
    @DisplayName("Register thất bại với UserName rỗng")
    void testRegisterFailEmptyUserNameWithMockedService() throws Exception {

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        "{\"username\":\"\",\"password\":\"Pass123\",\"firstName\":\"John\",\"lastName\":\"Doe\"}"))
                .andExpect(status().isBadRequest());

    }

      @Test
    @DisplayName("Register thất bại thiếu UserName")
    void testRegisterFailMissUserNameWithMockedService() throws Exception {

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        "{\"password\":\"Pass123\",\"firstName\":\"John\",\"lastName\":\"Doe\"}"))
                .andExpect(status().isBadRequest());

    }
    
    @Test
    @DisplayName("Register thất bại với PassWord rỗng")
    void testRegisterFailEmptyPassWordWithMockedService() throws Exception {

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        "{\"username\":\"newuser@example.com\",\"password\":\"\",\"firstName\":\"John\",\"lastName\":\"Doe\"}"))
                .andExpect(status().isBadRequest());

    }

     @Test
    @DisplayName("Register thất bại thiếu PassWord")
    void testRegisterFailMissPassWordWithMockedService() throws Exception {

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        "{\"username\":\"newuser@example.com\",\"firstName\":\"John\",\"lastName\":\"Doe\"}"))
                .andExpect(status().isBadRequest());

    }

     @Test
    @DisplayName("Register thất bại với FirstName rỗng")
    void testRegisterFailEmptyFirstNameWithMockedService() throws Exception {

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        "{\"username\":\"newuser@example.com\",\"password\":\"Pass123\",\"firstName\":\"\",\"lastName\":\"Doe\"}"))
                .andExpect(status().isBadRequest());

    }

    @Test
    @DisplayName("Register thất bại thiếu FirstName")
    void testRegisterFailMissFirstNameWithMockedService() throws Exception {

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        "{\"username\":\"newuser@example.com\",\"password\":\"Pass123\",\"lastName\":\"Doe\"}"))
                .andExpect(status().isBadRequest());

    }

    @Test
    @DisplayName("Register thất bại với LastName rỗng")
    void testRegisterFailEmptyLastNameWithMockedService() throws Exception {

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        "{\"username\":\"newuser@example.com\",\"password\":\"Pass123\",\"firstName\":\"John\",\"lastName\":\"\"}"))
                .andExpect(status().isBadRequest());

    }


     @Test
    @DisplayName("Register thất bại thiếu LastName")
    void testRegisterFailMissLastNameWithMockedService() throws Exception {

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        "{\"username\":\"newuser@example.com\",\"password\":\"Pass123\",\"firstName\":\"John\"}"))
                .andExpect(status().isBadRequest());

    }

    



}
