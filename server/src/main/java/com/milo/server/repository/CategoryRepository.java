package com.milo.server.repository;

import com.milo.server.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Tìm các danh mục mặc định hoặc danh mục theo loại (Thu/Chi)
    List<Category> findByIsDefaultTrue();
}
