package com.milo.server.repository;

import com.milo.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Tìm kiếm người dùng bằng username để phục vụ đăng nhập
    Optional<User> findByUsername(String username);

    // Lấy danh sách tất cả người dùng (không bao gồm chính admin) để quản lý
    List<User> findByRole(String role);
}
