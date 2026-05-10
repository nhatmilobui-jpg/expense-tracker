package com.milo.server.service;

import com.milo.server.entity.Category;
import com.milo.server.entity.User;
import com.milo.server.repository.CategoryRepository;
import com.milo.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AdminService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<User> getAllUsers() {
        return userRepository.findByRole("USER");
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Category createDefaultCategory(Category category) {
        category.setDefault(true); // Đánh dấu là danh mục hệ thống [cite: 8]
        return categoryRepository.save(category);
    }
}
