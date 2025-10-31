package com.flogin.backend.service;

import com.flogin.backend.entity.User;
import com.flogin.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

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

    // tìm kiếm theo email
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
