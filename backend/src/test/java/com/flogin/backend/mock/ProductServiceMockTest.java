package com.flogin.backend.mock;

import com.flogin.backend.dto.product.CreateProductRequest;
import com.flogin.backend.dto.product.ProductResponse;
import com.flogin.backend.dto.product.UpdateProductRequest;
import com.flogin.backend.entity.Category;
import com.flogin.backend.entity.Product;
import com.flogin.backend.exception.BadRequestException;
import com.flogin.backend.repository.ProductRepository;
import com.flogin.backend.service.CategoryService;
import com.flogin.backend.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProductServiceMockTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;
    private Category testCategory;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("Electronics");

        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("Laptop Lenovo");
        testProduct.setPrice(BigDecimal.valueOf(15000000));
        testProduct.setQuantity(10);
        testProduct.setCategory(testCategory);
    }

    /// --------------- Create ------------------------

    @Test
    void createProductSuccess() {
        CreateProductRequest createProductRequest = new CreateProductRequest();
        createProductRequest.setName("Laptop Lenovo");
        createProductRequest.setPrice(BigDecimal.valueOf(15000000));
        createProductRequest.setQuantity(10);
        createProductRequest.setDescription("hello");
        createProductRequest.setCategoryName("Electronics");

        when(categoryService.findByName("Electronics")).thenReturn(testCategory);
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        ProductResponse productResponse = productService.createProduct(createProductRequest);

        assertNotNull(productResponse);
        assertEquals("Laptop Lenovo", productResponse.getName());

        verify(categoryService, times(1)).findByName("Electronics");
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void createProductButInvalidRequest() {
        CreateProductRequest request = new CreateProductRequest();
        request.setName("");
        request.setPrice(BigDecimal.ZERO);
        request.setQuantity(0);
        request.setCategoryName("Electronics");

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> productService.createProduct(request));

        assertTrue(ex.getMessage().contains("Request không hợp lệ: vui lòng thử lại!!!"));
    }

    @Test
    void createProductButCategoryNull() {
        CreateProductRequest createProductRequest = new CreateProductRequest();
        createProductRequest.setName("Laptop Lenovo");
        createProductRequest.setPrice(BigDecimal.valueOf(15000000));
        createProductRequest.setQuantity(10);
        createProductRequest.setDescription("hello");
        createProductRequest.setCategoryName("null");

        when(categoryService.findByName("null")).thenReturn(null);

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> productService.createProduct(createProductRequest));

        assertTrue(ex.getMessage().contains("Request không hợp lệ: danh mục không tồn tại"));
    }

    @Test
    void createProductButDescriptionIsNullOrEmpty() {
        CreateProductRequest createProductRequest = new CreateProductRequest();
        createProductRequest.setName("Laptop Lenovo");
        createProductRequest.setPrice(BigDecimal.valueOf(15000000));
        createProductRequest.setQuantity(10);
        createProductRequest.setDescription(null);
        createProductRequest.setCategoryName("Electronics");

        when(categoryService.findByName("Electronics")).thenReturn(testCategory);
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        ProductResponse productResponse = productService.createProduct(createProductRequest);

        assertEquals("Không có mô tả", productResponse.getDescription());
    }




    // ---------------- READ -------------------------
    @Test
    void readDetailProductSuccess() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        Product res = productService.findById(1L);

        assertNotNull(res);
        assertEquals("Laptop Lenovo", res.getName());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void readDetailProductButIdNotFound() {
        when(productRepository.findById(2L)).thenReturn(Optional.empty());

        Product res = productService.findById(2L);
        assertNull(res);
        verify(productRepository, times(1)).findById(2L);
    }


    // ---------------- Update ----------------------
    @Test
    void updateProductSuccess() {
        UpdateProductRequest updateProductRequest = new UpdateProductRequest();
        updateProductRequest.setName("Macbook");
        updateProductRequest.setPrice(BigDecimal.valueOf(12000000));
        updateProductRequest.setQuantity(5);
        updateProductRequest.setDescription("hello");
        updateProductRequest.setCategoryName("Electronics");

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(categoryService.findByName("Electronics")).thenReturn(testCategory);
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        ProductResponse productResponse = productService.update(updateProductRequest,1L);

        assertNotNull(productResponse);
        assertEquals("Macbook", productResponse.getName());


        verify(productRepository, times(1)).findById(1L);
        verify(productRepository,times(1)).save(any(Product.class));
    }

    @Test
    void updateProductButRequestInvalid() {
        UpdateProductRequest updateProductRequest = new UpdateProductRequest();
        updateProductRequest.setName("");
        updateProductRequest.setPrice(BigDecimal.valueOf(-12000000));
        updateProductRequest.setQuantity(-5);

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> productService.update(updateProductRequest,1L));

        assertTrue(ex.getMessage().contains("Request không hợp lệ: vui lòng thử lại!!!"));

    }

    @Test
    void updateProductButIdNotExists() {
        UpdateProductRequest updateProductRequest = new UpdateProductRequest();
        updateProductRequest.setName("Macbook");
        updateProductRequest.setPrice(BigDecimal.valueOf(12000000));
        updateProductRequest.setQuantity(5);
        updateProductRequest.setDescription("hello");
        updateProductRequest.setCategoryName("Electronics");

        when(productRepository.findById(9999L)).thenReturn(Optional.empty());

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> productService.update(updateProductRequest,9999L));

        assertTrue(ex.getMessage().contains("Request không hợp lệ: sản phẩm không tồn tại!!!"));
    }

    @Test
    void updateProductButCategoryNotExist() {
        UpdateProductRequest updateProductRequest = new UpdateProductRequest();
        updateProductRequest.setName("Macbook");
        updateProductRequest.setPrice(BigDecimal.valueOf(12000000));
        updateProductRequest.setQuantity(5);
        updateProductRequest.setDescription("hello");
        updateProductRequest.setCategoryName("null");

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(categoryService.findByName("null")).thenReturn(null);

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> productService.update(updateProductRequest,1L));

        assertTrue(ex.getMessage().contains("Request không hợp lệ: danh mục không tồn tại"));
    }

    //---------------- Delete --------------------------
    @Test
    void deleteProductSuccess() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        ProductResponse productResponse = productService.deleteProduct(1L);

        assertNotNull(productResponse);

        assertEquals("Laptop Lenovo", productResponse.getName());
        verify(productRepository, times(1)).delete(testProduct);
    }

    @Test
    void deleteProductButProductNotExist() {
        when(productRepository.findById(9999L)).thenReturn(Optional.empty());

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> productService.deleteProduct(9999L));

        assertTrue(ex.getMessage().contains("Sản phẩm không tồn tại"));

    }

    // -------------------- Get All ------------------------------
    @Test
    void getAllWithPagination() {
        Page<Product> page = new PageImpl<>(List.of(testProduct));

        when(productRepository.findAll(any(PageRequest.class))).thenReturn(page);

        HashMap<String, Object> res = (HashMap<String, Object>) productService.getProducts(1,10, null, null, "name", "asc");

        assertNotNull(res);
        assertEquals(1, ((List<?>)res.get("data")).size());
        assertEquals(1L, ((ProductResponse)((List<?>)res.get("data")).get(0)).getId());
        verify(productRepository, times(1)).findAll(any(PageRequest.class));
    }

    @Test
    void getProductWithSearch() {
        Page<Product> page = new PageImpl<>(List.of(testProduct));

        when(productRepository.findByNameContainingIgnoreCase(eq("Laptop Lenovo"), any(PageRequest.class))).thenReturn(page);

        HashMap<String, Object> res = (HashMap<String, Object>) productService.getProducts(1,10, "Laptop Lenovo",null ,"name", "esc");

        assertEquals(1, ((List<?>)res.get("data")).size());
    }

    @Test
    void getProductWithSortDesc() {
        Page<Product> page = new PageImpl<>(List.of(testProduct));

        when(productRepository.findAll(any(PageRequest.class))).thenReturn(page);

        HashMap<String, Object> res = (HashMap<String, Object>) productService.getProducts(1,10, null,null ,"name", "desc");

        assertEquals(1, ((List<?>)res.get("data")).size());
    }

    @Test
    void getProductWithSearchIsEmpty() {
        Page<Product> page = new PageImpl<>(List.of(testProduct));

        when(productRepository.findAll(any(PageRequest.class))).thenReturn(page);

        HashMap<String, Object> res = (HashMap<String, Object>) productService.getProducts(1,10, "",null ,"name", "asc");

        assertEquals(1, ((List<?>)res.get("data")).size());
    }

    @Test
    void testFindAll() {
        List<Product> products = List.of(
                new Product(1L, "product test", BigDecimal.valueOf(10000),10,"description",new Category()));

        when(productRepository.findAll()).thenReturn(products);

        List<Product> result = productService.findAll();

        assertEquals(1, result.size());
        verify(productRepository, times(1)).findAll();
    }

}
