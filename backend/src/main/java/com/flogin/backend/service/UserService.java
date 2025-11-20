package com.flogin.backend.service;

import org.springframework.stereotype.Service;

import com.flogin.backend.entity.User;
import com.flogin.backend.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    // thêm user
    public User save(User newUser) {
        return userRepository.save(newUser);
    }
    //tìm kiếm theo id
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // tìm kiếm theo username
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
}
