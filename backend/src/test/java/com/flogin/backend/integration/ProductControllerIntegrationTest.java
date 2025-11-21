package com.flogin.backend.integration;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.hamcrest.Matchers.hasSize;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.backend.controller.ProductController;
import com.flogin.backend.dto.product.CreateProductRequest;
import com.flogin.backend.dto.product.ProductResponse;
import com.flogin.backend.service.ProductService;
import com.flogin.backend.entity.Product;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
class ProductControllerIntegrationTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        private ProductService productService; // Mock Service của Product

        @Test
        @DisplayName("GET /api/products - Lay danh sach san pham thanh cong")
        void testGetAllProducts() throws Exception {
                // 1. ARRANGE: Chuẩn bị dữ liệu giả
                List<Product> mockList = Arrays.asList(
                                new Product(1L, "Laptop Dell", new BigDecimal("15000000"), 10, "Electronics"),
                                new Product(2L, "Mouse Logitech", new BigDecimal("200000"), 50, "Accessories"));

                when(productService.findAll()).thenReturn(mockList);

                // 2. ACT & ASSERT
                mockMvc.perform(get("/api/products")
                                .contentType(MediaType.APPLICATION_JSON))

                                .andDo(print())
                                .andExpect(status().isOk())

                                // Kiểm tra mảng JSON trả về
                                .andExpect(jsonPath("$.content", hasSize(2))) // Phải có đúng 2 món
                                .andExpect(jsonPath("$.content[0].name").value("Laptop Dell")) // Món đầu tiên tên đúng
                                .andExpect(jsonPath("$.content[1].price").value(200000.0)); // Món thứ hai giá đúng
        }

        @Test
        @DisplayName("POST /api/products - Tao san pham moi thanh cong")
        void testCreateProduct() throws Exception {
                // 1. ARRANGE
                CreateProductRequest requestDto = new CreateProductRequest("Iphone 15", new BigDecimal("30000000"),
                                5,
                                "Dien thoai cua L0ng",
                                "Phone");

                ProductResponse savedDto = new ProductResponse(1L, "Iphone 15", new BigDecimal("30000000"), 5,
                                "Dien thoai cua L0ng", "Phone");

                when(productService.createProduct(requestDto)).thenReturn(savedDto);

                // 2. ACT & ASSERT
                mockMvc.perform(post("/api/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestDto)))

                                .andDo(print())
                                .andExpect(status().isOk()) // Hoặc .isOk()

                                .andExpect(jsonPath("$.id").value(1))
                                .andExpect(jsonPath("$.name").value("Iphone 15"));

                // 3. VERIFY (Kiểm tra xem Service có thực sự được gọi không)
                verify(productService, times(1)).createProduct(requestDto);
        }

        @Test
        @DisplayName("DELETE /api/products/{id} - Xoa san pham thanh cong")
        void testDeleteProduct() throws Exception {
                // 1. ARRANGE
                Long productId = 1L;
                ProductResponse productResponse = new ProductResponse(1L, "Iphone 15", new BigDecimal("30000000"), 5,
                                "Dien thoai cua L0ng", "Phone");

                when(productService.deleteProduct(productId)).thenReturn(productResponse);

                // 2. ACT & ASSERT
                mockMvc.perform(delete("/api/products/{id}", productId)) // Truyền biến vào URL
                                .andExpect(status().isOk()); // Hoặc isNoContent() (204) tùy code
                // .andExpect(content().string("Xóa thành công")); // Nếu controller trả về
                // chuỗi text

                // 3. VERIFY
                verify(productService, times(1)).deleteProduct(productId);
        }
}