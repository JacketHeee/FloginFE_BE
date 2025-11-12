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
    public ResponseEntity<?> getAllProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder
    ) {
        var result = productService.getProducts(page, limit, search, category, sortBy, sortOrder);
        return ResponseEntity.ok(result);
    }


    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody CreateProductRequest createRequest) {
        ProductResponse productResponse = productService.createProduct(createRequest);
        return ResponseEntity.ok(productResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct (@Valid @RequestBody UpdateProductRequest updateRequest,@PathVariable Long id)  {
        ProductResponse productResponse = productService.update(updateRequest, id);
        return ResponseEntity.ok(productResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ProductResponse> deleteProduct(@PathVariable Long id) {
        ProductResponse productResponse = productService.deleteProduct(id);
        return ResponseEntity.ok(productResponse);
    }
}
