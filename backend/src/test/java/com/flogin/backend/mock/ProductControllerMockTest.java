package com.flogin.backend.mock;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.backend.controller.ProductController;
import com.flogin.backend.dto.product.CreateProductRequest;
import com.flogin.backend.dto.product.ProductResponse;
import com.flogin.backend.dto.product.UpdateProductRequest;
import com.flogin.backend.entity.Product;
import com.flogin.backend.entity.Category;
import com.flogin.backend.repository.ProductRepository;
import com.flogin.backend.service.ProductService;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ProductControllerMockTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @MockBean
    private ProductRepository productRepository;

    @Autowired
    private ObjectMapper objectMapper;

    // ======================== GET ALL PRODUCTS ============================
    @Test
    @DisplayName("TC1: Lấy danh sách sản phẩm thành công")
    void testGetAllProductsSuccess() throws Exception {
        Map<String, Object> mockResponse = new HashMap<>();
        mockResponse.put("data", List.of());
        mockResponse.put("total", 0L);
        mockResponse.put("page", 1);
        mockResponse.put("limit", 10);
        mockResponse.put("totalPages", 0);

        when(productService.getProducts(1, 10, null, null, "id", "asc"))
                .thenReturn(mockResponse);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page").value(1))
                .andExpect(jsonPath("$.limit").value(10));

        verify(productService, times(1)).getProducts(1, 10, null, null, "id", "asc");
        verify(productRepository, never()).findAll();
    }

    // ======================== GET PRODUCT BY ID ============================
    @Test
    @DisplayName("TC2: Lấy sản phẩm theo ID thành công")
    void testGetProductByIdSuccess() throws Exception {
        Category category = new Category();
        category.setName("Electronics");

        Product mockProduct = new Product();
        mockProduct.setId(1L);
        mockProduct.setName("iPhone");
        mockProduct.setPrice(new BigDecimal("999.99"));
        mockProduct.setQuantity(10);
        mockProduct.setDescription("Apple iPhone");
        mockProduct.setCategory(category);

        when(productService.findById(1L)).thenReturn(mockProduct);

        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("iPhone"))
                .andExpect(jsonPath("$.price").value(999.99));

        verify(productService, times(1)).findById(1L);
        verify(productRepository, never()).findById(anyLong());
    }

    // ======================== CREATE PRODUCT ============================
    @Test
    @DisplayName("TC3: Tạo sản phẩm thành công")
    void testCreateProductSuccess() throws Exception {
        ProductResponse mockResponse = new ProductResponse(
                1L, "iPhone", new BigDecimal("999.99"), 10, "Apple iPhone", "Electronics"
        );

        when(productService.createProduct(any(CreateProductRequest.class)))
                .thenReturn(mockResponse);

        CreateProductRequest request = new CreateProductRequest(
                "iPhone", new BigDecimal("999.99"), 10, "Apple iPhone", "Electronics"
        );

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("iPhone"))
                .andExpect(jsonPath("$.price").value(999.99))
                .andExpect(jsonPath("$.categoryName").value("Electronics"));

        verify(productService, times(1)).createProduct(any(CreateProductRequest.class));
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    @DisplayName("TC4: Tạo sản phẩm thất bại - tên rỗng")
    void testCreateProductFailEmptyName() throws Exception {
        CreateProductRequest request = new CreateProductRequest(
                "", new BigDecimal("999.99"), 10, "Description", "Electronics"
        );

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC5: Tạo sản phẩm thất bại - giá âm")
    void testCreateProductFailNegativePrice() throws Exception {
        CreateProductRequest request = new CreateProductRequest(
                "iPhone", new BigDecimal("-100"), 10, "Description", "Electronics"
        );

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    // ======================== UPDATE PRODUCT ============================
    @Test
    @DisplayName("TC6: Cập nhật sản phẩm thành công")
    void testUpdateProductSuccess() throws Exception {
        ProductResponse mockResponse = new ProductResponse(
                1L, "iPhone Updated", new BigDecimal("1099.99"), 15, "Updated iPhone", "Electronics"
        );

        when(productService.update(any(UpdateProductRequest.class), anyLong()))
                .thenReturn(mockResponse);

        UpdateProductRequest request = new UpdateProductRequest();
        request.setName("iPhone Updated");
        request.setPrice(new BigDecimal("1099.99"));
        request.setQuantity(15);
        request.setDescription("Updated iPhone");
        request.setCategoryName("Electronics");

        mockMvc.perform(put("/api/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("iPhone Updated"))
                .andExpect(jsonPath("$.price").value(1099.99));

        verify(productService, times(1)).update(any(UpdateProductRequest.class), eq(1L));
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    @DisplayName("TC7: Cập nhật sản phẩm thất bại - thiếu tên")
    void testUpdateProductFailMissingName() throws Exception {
        String body = """
        {
            "price": 999.99,
            "quantity": 10,
            "description": "Description",
            "categoryName": "Electronics"
        }
        """;

        mockMvc.perform(put("/api/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    // ======================== DELETE PRODUCT ============================
    @Test
    @DisplayName("TC8: Xóa sản phẩm thành công")
    void testDeleteProductSuccess() throws Exception {
        ProductResponse mockResponse = new ProductResponse(
                1L, "iPhone", new BigDecimal("999.99"), 10, "Apple iPhone", "Electronics"
        );

        when(productService.deleteProduct(1L)).thenReturn(mockResponse);

        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("iPhone"));

        verify(productService, times(1)).deleteProduct(1L);
        verify(productRepository, never()).delete(any(Product.class));
    }

    @Test
    @DisplayName("TC9: Tìm kiếm sản phẩm với search parameter")
    void testGetProductsWithSearch() throws Exception {
        Map<String, Object> mockResponse = new HashMap<>();
        mockResponse.put("data", List.of());
        mockResponse.put("total", 5L);
        mockResponse.put("page", 1);
        mockResponse.put("limit", 10);
        mockResponse.put("totalPages", 1);

        when(productService.getProducts(1, 10, "iPhone", null, "id", "asc"))
                .thenReturn(mockResponse);

        mockMvc.perform(get("/api/products")
                        .param("search", "iPhone"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(5));

        verify(productService, times(1)).getProducts(1, 10, "iPhone", null, "id", "asc");
        verify(productRepository, never()).findByNameContainingIgnoreCase(anyString(), any());
    }

    @Test
    @DisplayName("TC10: Lấy sản phẩm với pagination")
    void testGetProductsWithPagination() throws Exception {
        Map<String, Object> mockResponse = new HashMap<>();
        mockResponse.put("data", List.of());
        mockResponse.put("total", 50L);
        mockResponse.put("page", 2);
        mockResponse.put("limit", 5);
        mockResponse.put("totalPages", 10);

        when(productService.getProducts(2, 5, null, null, "name", "desc"))
                .thenReturn(mockResponse);

        mockMvc.perform(get("/api/products")
                        .param("page", "2")
                        .param("limit", "5")
                        .param("sortBy", "name")
                        .param("sortOrder", "desc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page").value(2))
                .andExpect(jsonPath("$.totalPages").value(10));

        verify(productService, times(1)).getProducts(2, 5, null, null, "name", "desc");
        verify(productRepository, never()).findAll(any(org.springframework.data.domain.PageRequest.class));
    }
}
