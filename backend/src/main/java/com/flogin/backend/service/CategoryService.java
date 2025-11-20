package com.flogin.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.flogin.backend.entity.Category;
import com.flogin.backend.repository.CategoryRepository;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Category findById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public Category findByName(String name) {
        return categoryRepository.findByName(name).orElse(null);
    }
}
