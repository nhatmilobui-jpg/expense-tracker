package com.milo.server.controller;

import com.milo.server.entity.Category;
import com.milo.server.repository.TransactionRepository;
import com.milo.server.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private TransactionRepository transactionRepository;

    // Quản lý người dùng [cite: 8]
    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> removeUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("Đã xóa tài khoản người dùng");
    }

    // Quản lý danh mục mặc định [cite: 8]
    @PostMapping("/categories")
    public ResponseEntity<?> addCategory(@RequestBody Category category) {
        return ResponseEntity.ok(adminService.createDefaultCategory(category));
    }

    // Báo cáo thống kê toàn hệ thống [cite: 9]
    @GetMapping("/stats")
    public ResponseEntity<?> getSystemStats() {
        return ResponseEntity.ok(transactionRepository.sumSystemWideTransactions());
    }
}
