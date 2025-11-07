package com.flogin.backend.controller;

import com.flogin.backend.dto.product.ApiResponse;
import com.flogin.backend.dto.product.CreateProductRequest;
import com.flogin.backend.dto.product.ProductResponse;
import com.flogin.backend.dto.product.UpdateProductRequest;
import com.flogin.backend.entity.Product;
import com.flogin.backend.service.ProductService;
import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts() {
        List<Product> products = productService.findAll();
        List<ProductResponse> response = products.stream()
                .map(p -> new ProductResponse(
                        p.getId(),
                        p.getName(),
                        p.getPrice(),
                        p.getQuantity(),
                        p.getDescription(),
                        p.getCategory().getName()
                ))
                .toList();
        return ResponseEntity.ok(new ApiResponse<>("Danh sách sản phẩm: ", response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody CreateProductRequest createRequest) {
        ProductResponse productResponse = productService.createProduct(createRequest);
        return ResponseEntity.ok(new ApiResponse<>("Tạo sản phẩm thành công", productResponse));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct (@Valid @RequestBody UpdateProductRequest updateRequest,@PathVariable Long id)  {
        ProductResponse productResponse = productService.update(updateRequest, id);
        return ResponseEntity.ok(new ApiResponse<>("Cập nhật sản phẩm thành công", productResponse));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> deteleProduct(@PathVariable Long id) {
        ProductResponse productResponse = productService.deleteProduct(id);
        return ResponseEntity.ok(new ApiResponse<>("Xóa sản phẩm thành công",productResponse));
    }
}
