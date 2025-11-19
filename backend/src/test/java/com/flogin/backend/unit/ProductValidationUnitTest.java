package com.flogin.backend.unit;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class ProductValidationUnitTest {

    private HashMap<String, String> validationProduct(String name, BigDecimal price, Integer quantity, String description,String categoryName) {
        HashMap<String, String> errors = new HashMap<>();

        //name
        if(name == null || name.trim().isEmpty()) {
            errors.put("name", "Tên sản phẩm không được để trống");
        }

        //price
        if(price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
            errors.put("price", "Giá sản phẩm phải lớn hơn 0");
        }else if ( price.compareTo(BigDecimal.valueOf(999_999_999)) >= 999_999_999) {
            errors.put("price", "Giá sản phẩm không được vượt quá 999,999,999");
        }

        //quantity
        if(quantity == null || quantity  < 0) {
            errors.put("quantity", "Số lượng sản phẩm phải lớn hơn 0");
        }else if (quantity > 99_999) {
            errors.put("quantity", "Số lượng không vượt quá 99,999");
        }

        //description
        if(description != null && description.length() > 500) {
            errors.put("description", "Mô tả không quá 500 kí tự");
        }

        if(categoryName == null || categoryName.trim().isEmpty()) {
            errors.put("categoryName", "danh mục phải có");
        }

        return errors;
    }

    //------------ Test case ---------------

    @Test
    void testEmptyProductName() {
        HashMap<String,String> errors = validationProduct("", BigDecimal.valueOf(1000.0),10,"hello world","Electronics");
        assertEquals("Tên sản phẩm không được để trống", errors.get("name"));
    }

    @Test
    void testNegativePrice() {
        HashMap<String,String> errors = validationProduct("product", BigDecimal.valueOf(-1000),10,"hello world","Electronics");
        assertEquals("Giá sản phẩm phải lớn hơn 0",errors.get("price"));
    }

    @Test
    void testNegativeQuantity() {
        HashMap<String,String> errors = validationProduct("product", BigDecimal.valueOf(1000),-10,"hello world","Electronics");
        assertEquals("Số lượng sản phẩm phải lớn hơn 0",errors.get("quantity"));
    }

    @Test
    void testDescriptionLong() {
        HashMap<String,String> errors = validationProduct("product", BigDecimal.valueOf(1000),10,"hello".repeat(2000),"Electronics");
        assertEquals("Mô tả không quá 500 kí tự",errors.get("description"));
    }

    @Test
    void testCategoryEmpty() {
        Map<String, String> errors = validationProduct("Laptop", BigDecimal.valueOf(1000.0), 10, "Desc", "");
        assertEquals("danh mục phải có", errors.get("categoryName"));
    }

    @Test
    void testValidProduct() {
        Map<String, String> errors = validationProduct("Laptop Dell", BigDecimal.valueOf(15000000.0), 10, "Mô tả sản phẩm", "Electronics");
        assertTrue(errors.isEmpty());
    }

    @Test
    void testBoundaryPrice() {
        Map<String, String> errorsMin = validationProduct("Laptop", BigDecimal.valueOf(0.01), 10, "Desc", "Electronics");
        assertTrue(errorsMin.isEmpty());

        Map<String, String> errorsMax = validationProduct("Laptop", BigDecimal.valueOf(999_999_999.0), 10, "Desc", "Electronics");
        assertTrue(errorsMax.isEmpty());
    }

    @Test
    void testBoundaryQuantity() {
        Map<String, String> errorsMin = validationProduct("Laptop", BigDecimal.valueOf(1000.0), 0, "Desc", "Electronics");
        assertTrue(errorsMin.isEmpty());

        Map<String, String> errorsMax = validationProduct("Laptop", BigDecimal.valueOf(1000.0), 99_999, "Desc", "Electronics");
        assertTrue(errorsMax.isEmpty());
    }
}
