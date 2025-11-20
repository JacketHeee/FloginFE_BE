package com.flogin.backend.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.flogin.backend.dto.product.CreateProductRequest;
import com.flogin.backend.dto.product.ProductResponse;
import com.flogin.backend.dto.product.UpdateProductRequest;
import com.flogin.backend.entity.Category;
import com.flogin.backend.entity.Product;
import com.flogin.backend.exception.BadRequestException;
import com.flogin.backend.repository.ProductRepository;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryService categoryService;

    public ProductService(ProductRepository productRepository,CategoryService categoryService) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
    }
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Product findById(Long id) {
        return productRepository.findById(id).orElse(null);
    }


    //create
    public ProductResponse createProduct(CreateProductRequest createRequest) {
        if(createRequest.getName().isBlank() || createRequest.getPrice().compareTo(BigDecimal.ZERO) <= 0 || createRequest.getQuantity() <= 0) {
            throw new BadRequestException("Request không hợp lệ: vui lòng thử lại!!!");
        }
        Category category = categoryService.findByName(createRequest.getCategoryName());
        if(category == null) throw new BadRequestException("Request không hợp lệ: danh mục không tồn tại");
        Product newProduct = new Product();
        newProduct.setName(createRequest.getName());
        newProduct.setPrice(createRequest.getPrice());
        newProduct.setQuantity(createRequest.getQuantity());
        String description = createRequest.getDescription();
        if(description == null ||description.isEmpty()) description = "Không có mô tả";
        newProduct.setDescription(description);
        newProduct.setCategory(category);

        productRepository.save(newProduct);

        return new ProductResponse(newProduct.getId(), newProduct.getName(), newProduct.getPrice(), newProduct.getQuantity(), newProduct.getDescription(),newProduct.getCategory().getName());
    }

    //update
    public ProductResponse update(UpdateProductRequest updateRequest,Long id) {
        if(updateRequest.getName() == null || updateRequest.getPrice().compareTo(BigDecimal.ZERO) <=0 || updateRequest.getQuantity() <= 0) {
            throw new BadRequestException("Request không hợp lệ: vui lòng thử lại!!!");
        }

        Product updateProduct = findById(id);
        if(updateProduct == null) {
            throw new BadRequestException("Request không hợp lệ: sản phẩm không tồn tại!!!");
        }

        Category category = categoryService.findByName(updateRequest.getCategoryName());
        if(category == null) {
            throw new BadRequestException("Request không hợp lệ: danh mục không tồn tại");
        }
        updateProduct.setName(updateRequest.getName());
        updateProduct.setPrice(updateRequest.getPrice());
        updateProduct.setQuantity(updateRequest.getQuantity());
        updateProduct.setDescription(updateRequest.getDescription());
        updateProduct.setCategory(category);

        productRepository.save(updateProduct);
        return new ProductResponse(updateProduct.getId(), updateProduct.getName(), updateProduct.getPrice(), updateProduct.getQuantity(), updateProduct.getDescription(), updateProduct.getCategory().getName());
    }

    //delete
    public ProductResponse deleteProduct(Long id) {
        Product product = findById(id);
        if (product == null) {
            throw new BadRequestException("Sản phẩm không tồn tại");
        }
        productRepository.delete(product);

        return new ProductResponse(product.getId(), product.getName(), product.getPrice(), product.getQuantity(), product.getDescription(), product.getCategory().getName());
    }

    //pagination
    public Map<String,Object> getProducts(int page, int limit, String search, String category, String sortBy, String sortOrder) {
        PageRequest pageRequest = PageRequest.of(
                page - 1,
                limit,
                sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending()
        );

        Page<Product> productInPage;

        if(search != null && !search.isEmpty()) {
            productInPage = productRepository.findByNameContainingIgnoreCase(search,pageRequest);
        } else {
            productInPage = productRepository.findAll(pageRequest);
        }

        List<ProductResponse> productResponses = productInPage.getContent().stream()
                .map(product -> new ProductResponse(
                        product.getId(),
                        product.getName(),
                        product.getPrice(),
                        product.getQuantity(),
                        product.getDescription(),
                        product.getCategory().getName()
                )).toList();

        Map<String,Object> res = new HashMap<>();
        res.put("data", productResponses);
        res.put("total", productInPage.getTotalElements());
        res.put("page", page);
        res.put("limit", limit);
        res.put("totalPages", productInPage.getTotalPages());

        return res;
    }

}
