package com.flogin.backend.dto.product;

import lombok.Data;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Data
public class UpdateProductRequest {
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    @NotNull(message = "Giá sản phẩm không được để trống")
    @DecimalMin(value = "0.01", message = "Giá sản phẩm phải lớn hơn 0")
    private BigDecimal price;

    @Min(value = 1, message = "Số lượng sản phẩm phải ít nhất là 1")
    private int quantity;

    private String description;

    @NotBlank(message = "Danh mục sản phẩm không được để trống")
    private String categoryName;
}
