package com.flogin.backend.integration;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.hamcrest.Matchers.hasSize;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.backend.controller.ProductController;
import com.flogin.backend.dto.product.CreateProductRequest;
import com.flogin.backend.dto.product.ProductResponse;
import com.flogin.backend.dto.product.UpdateProductRequest;
import com.flogin.backend.service.ProductService;
import com.flogin.backend.entity.Product;
import com.flogin.backend.exception.BadRequestException;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
class ProductControllerIntegrationTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockitoBean
        private ProductService productService; // Mock Service của Product

        @Test
        @DisplayName("GET /api/products - Lay danh sach san pham thanh cong")
        void testGetAllProducts() throws Exception {
                // 1. ARRANGE
                List<ProductResponse> mockProductResponses = Arrays.asList(
                                new ProductResponse(1L, "Laptop Dell", new BigDecimal("15000000"), 10,
                                                "May tinh xach tay", "Electronics"),
                                new ProductResponse(2L, "Mouse Logitech", new BigDecimal("200000"), 50,
                                                "Chuot khong day", "Accessories"));

                Map<String, Object> mockResponse = new HashMap<>();
                mockResponse.put("data", mockProductResponses);
                mockResponse.put("total", 2L);
                mockResponse.put("page", 1);
                mockResponse.put("limit", 10);
                mockResponse.put("totalPages", 1);

                when(productService.getProducts(1, 10, null, null, "id", "asc"))
                                .thenReturn(mockResponse);

                // 2. ACT & ASSERT
                mockMvc.perform(get("/api/products")
                                .param("page", "1")
                                .param("limit", "10")
                                .contentType(MediaType.APPLICATION_JSON))
                                .andDo(print())
                                .andExpect(status().isOk())

                                // Kiểm tra dữ liệu trả về
                                .andExpect(jsonPath("$.data", hasSize(2))) // Phải có đúng 2 sản phẩm
                                .andExpect(jsonPath("$.data[0].name").value("Laptop Dell")) // Sản phẩm đầu tiên tên
                                                                                            // đúng
                                .andExpect(jsonPath("$.data[1].price").value(200000)) // Sản phẩm thứ hai giá đúng
                                .andExpect(jsonPath("$.total").value(2))
                                .andExpect(jsonPath("$.page").value(1))
                                .andExpect(jsonPath("$.limit").value(10))
                                .andExpect(jsonPath("$.totalPages").value(1));
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

        @Test
        @DisplayName("GET /api/products/{id} - Lay san pham theo ID thanh cong")
        void testGetProduct() throws Exception {
                // 1. ARRANGE
                Long productId = 1L;
                Product mockProduct = new Product();
                mockProduct.setId(1L);
                mockProduct.setName("Laptop Dell");
                mockProduct.setPrice(new BigDecimal("15000000"));
                mockProduct.setQuantity(10);
                mockProduct.setDescription("May tinh xach tay cao cap");

                when(productService.findById(productId)).thenReturn(mockProduct);

                // 2. ACT & ASSERT
                mockMvc.perform(get("/api/products/{id}", productId)
                                .contentType(MediaType.APPLICATION_JSON))
                                .andDo(print())
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(1))
                                .andExpect(jsonPath("$.name").value("Laptop Dell"))
                                .andExpect(jsonPath("$.price").value(15000000))
                                .andExpect(jsonPath("$.quantity").value(10))
                                .andExpect(jsonPath("$.description").value("May tinh xach tay cao cap"));

                // 3. VERIFY
                verify(productService, times(1)).findById(productId);
        }

        @Test
        @DisplayName("PUT /api/products/{id} - Cap nhat san pham thanh cong")
        void testPutProduct() throws Exception {
                // 1. ARRANGE
                Long productId = 1L;
                UpdateProductRequest updateRequest = new UpdateProductRequest();
                updateRequest.setName("Laptop Dell Updated");
                updateRequest.setPrice(new BigDecimal("18000000"));
                updateRequest.setQuantity(15);
                updateRequest.setDescription("May tinh xach tay cao cap da nang cap");
                updateRequest.setCategoryName("Electronics");

                ProductResponse updatedProduct = new ProductResponse(
                                1L,
                                "Laptop Dell Updated",
                                new BigDecimal("18000000"),
                                15,
                                "May tinh xach tay cao cap da nang cap",
                                "Electronics");

                when(productService.update(any(UpdateProductRequest.class), eq(productId)))
                                .thenReturn(updatedProduct);

                // 2. ACT & ASSERT
                mockMvc.perform(put("/api/products/{id}", productId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updateRequest)))
                                .andDo(print())
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(1))
                                .andExpect(jsonPath("$.name").value("Laptop Dell Updated"))
                                .andExpect(jsonPath("$.price").value(18000000))
                                .andExpect(jsonPath("$.quantity").value(15))
                                .andExpect(jsonPath("$.description").value("May tinh xach tay cao cap da nang cap"))
                                .andExpect(jsonPath("$.categoryName").value("Electronics"));

                // 3. VERIFY
                verify(productService, times(1)).update(any(UpdateProductRequest.class), eq(productId));
        }

        // ========== BAD CASES & EDGE CASES ==========

        // GET ALL PRODUCTS - Edge Cases
        @Test
        @DisplayName("GET /api/products - Tra ve danh sach rong khi khong co san pham")
        void testGetAllProducts_EmptyList() throws Exception {
                Map<String, Object> emptyResponse = new HashMap<>();
                emptyResponse.put("data", Arrays.asList());
                emptyResponse.put("total", 0L);
                emptyResponse.put("page", 1);
                emptyResponse.put("limit", 10);
                emptyResponse.put("totalPages", 0);

                when(productService.getProducts(1, 10, null, null, "id", "asc"))
                                .thenReturn(emptyResponse);

                mockMvc.perform(get("/api/products")
                                .param("page", "1")
                                .param("limit", "10"))
                                .andDo(print())
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.data", hasSize(0)))
                                .andExpect(jsonPath("$.total").value(0))
                                .andExpect(jsonPath("$.totalPages").value(0));
        }

        @Test
        @DisplayName("GET /api/products - Tim kiem voi tu khoa khong ton tai")
        void testGetAllProducts_SearchNoResults() throws Exception {
                Map<String, Object> emptyResponse = new HashMap<>();
                emptyResponse.put("data", Arrays.asList());
                emptyResponse.put("total", 0L);
                emptyResponse.put("page", 1);
                emptyResponse.put("limit", 10);
                emptyResponse.put("totalPages", 0);

                when(productService.getProducts(1, 10, "xyz123", null, "id", "asc"))
                                .thenReturn(emptyResponse);

                mockMvc.perform(get("/api/products")
                                .param("page", "1")
                                .param("limit", "10")
                                .param("search", "xyz123"))
                                .andDo(print())
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.data", hasSize(0)));
        }

        // CREATE PRODUCT - Bad Cases
        @Test
        @DisplayName("POST /api/products - Tao san pham that bai khi thieu ten")
        void testCreateProduct_MissingName() throws Exception {
                CreateProductRequest requestDto = new CreateProductRequest(null, new BigDecimal("30000000"),
                                5, "Dien thoai", "Phone");

                mockMvc.perform(post("/api/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestDto)))
                                .andDo(print())
                                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("POST /api/products - Tao san pham that bai khi gia <= 0")
        void testCreateProduct_InvalidPrice() throws Exception {
                CreateProductRequest requestDto = new CreateProductRequest("Iphone 15", new BigDecimal("0"),
                                5, "Dien thoai", "Phone");

                mockMvc.perform(post("/api/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestDto)))
                                .andDo(print())
                                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("POST /api/products - Tao san pham that bai khi so luong <= 0")
        void testCreateProduct_InvalidQuantity() throws Exception {
                CreateProductRequest requestDto = new CreateProductRequest("Iphone 15", new BigDecimal("30000000"),
                                0, "Dien thoai", "Phone");

                mockMvc.perform(post("/api/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestDto)))
                                .andDo(print())
                                .andExpect(status().isBadRequest());
        }

        // GET PRODUCT BY ID - Bad Cases
        @Test
        @DisplayName("GET /api/products/{id} - Lay san pham that bai khi ID khong ton tai")
        void testGetProduct_NotFound() throws Exception {
                Long productId = 999L;

                when(productService.findById(productId)).thenReturn(null);

                mockMvc.perform(get("/api/products/{id}", productId))
                                .andDo(print())
                                .andExpect(status().isOk())
                                .andExpect(content().string(""));
        }

        @Test
        @DisplayName("GET /api/products/{id} - Lay san pham voi ID = 0")
        void testGetProduct_IdZero() throws Exception {
                Long productId = 0L;

                when(productService.findById(productId)).thenReturn(null);

                mockMvc.perform(get("/api/products/{id}", productId))
                                .andDo(print())
                                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("GET /api/products/{id} - Lay san pham voi ID am")
        void testGetProduct_NegativeId() throws Exception {
                Long productId = -1L;

                when(productService.findById(productId)).thenReturn(null);

                mockMvc.perform(get("/api/products/{id}", productId))
                                .andDo(print())
                                .andExpect(status().isOk());
        }

        // UPDATE PRODUCT - Bad Cases
        @Test
        @DisplayName("PUT /api/products/{id} - Cap nhat san pham that bai khi ID khong ton tai")
        void testUpdateProduct_NotFound() throws Exception {
                Long productId = 999L;
                UpdateProductRequest updateRequest = new UpdateProductRequest();
                updateRequest.setName("Laptop Dell");
                updateRequest.setPrice(new BigDecimal("18000000"));
                updateRequest.setQuantity(15);
                updateRequest.setDescription("May tinh xach tay");
                updateRequest.setCategoryName("Electronics");

                when(productService.update(any(UpdateProductRequest.class), eq(productId)))
                                .thenThrow(new BadRequestException("Request không hợp lệ: sản phẩm không tồn tại!!!"));

                // BadRequestException se gay ra ServletException vi chua co exception handler
                assertThrows(Exception.class, () -> {
                        mockMvc.perform(put("/api/products/{id}", productId)
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(updateRequest)));
                });
        }

        @Test
        @DisplayName("PUT /api/products/{id} - Cap nhat san pham that bai khi thieu ten")
        void testUpdateProduct_MissingName() throws Exception {
                Long productId = 1L;
                UpdateProductRequest updateRequest = new UpdateProductRequest();
                updateRequest.setName(null);
                updateRequest.setPrice(new BigDecimal("18000000"));
                updateRequest.setQuantity(15);
                updateRequest.setDescription("May tinh xach tay");
                updateRequest.setCategoryName("Electronics");

                mockMvc.perform(put("/api/products/{id}", productId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updateRequest)))
                                .andDo(print())
                                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("PUT /api/products/{id} - Cap nhat san pham that bai khi so luong < 0")
        void testUpdateProduct_InvalidQuantity() throws Exception {
                Long productId = 1L;
                UpdateProductRequest updateRequest = new UpdateProductRequest();
                updateRequest.setName("Laptop Dell");
                updateRequest.setPrice(new BigDecimal("18000000"));
                updateRequest.setQuantity(-10);
                updateRequest.setDescription("May tinh xach tay");
                updateRequest.setCategoryName("Electronics");

                mockMvc.perform(put("/api/products/{id}", productId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updateRequest)))
                                .andDo(print())
                                .andExpect(status().isBadRequest());
        }

        // DELETE PRODUCT - Bad Cases
        @Test
        @DisplayName("DELETE /api/products/{id} - Xoa san pham that bai khi ID khong ton tai")
        void testDeleteProduct_NotFound() throws Exception {
                Long productId = 999L;

                when(productService.deleteProduct(productId))
                                .thenThrow(new BadRequestException("Sản phẩm không tồn tại"));

                // BadRequestException se gay ra ServletException vi chua co exception handler
                assertThrows(Exception.class, () -> {
                        mockMvc.perform(delete("/api/products/{id}", productId));
                });
        }

        @Test
        @DisplayName("DELETE /api/products/{id} - Xoa san pham voi ID = 0")
        void testDeleteProduct_IdZero() throws Exception {
                Long productId = 0L;

                when(productService.deleteProduct(productId))
                                .thenThrow(new BadRequestException("Sản phẩm không tồn tại"));

                // BadRequestException se gay ra ServletException vi chua co exception handler
                assertThrows(Exception.class, () -> {
                        mockMvc.perform(delete("/api/products/{id}", productId));
                });
        }

        @Test
        @DisplayName("DELETE /api/products/{id} - Xoa san pham voi ID am")
        void testDeleteProduct_NegativeId() throws Exception {
                Long productId = -1L;

                when(productService.deleteProduct(productId))
                                .thenThrow(new BadRequestException("Sản phẩm không tồn tại"));

                // BadRequestException se gay ra ServletException vi chua co exception handler
                assertThrows(Exception.class, () -> {
                        mockMvc.perform(delete("/api/products/{id}", productId));
                });
        }
}