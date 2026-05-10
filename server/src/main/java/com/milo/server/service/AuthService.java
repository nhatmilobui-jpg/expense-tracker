package com.milo.server.service;

import com.milo.server.entity.User;
import com.milo.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    public User register(User user) {
        // Mặc định vai trò là USER khi đăng ký mới
        user.setRole("USER");
        return userRepository.save(user);
    }

    public User login(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(u -> u.getPassword().equals(password)) // So sánh trực tiếp theo SRS
                .orElse(null);
    }

    public User updateProfile(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id).orElseThrow();
        existingUser.setFullName(updatedUser.getFullName());
        existingUser.setPassword(updatedUser.getPassword());
        return userRepository.save(existingUser);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
}
