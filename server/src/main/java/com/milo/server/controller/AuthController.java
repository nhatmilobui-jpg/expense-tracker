package com.milo.server.controller;

import com.milo.server.entity.User;
import com.milo.server.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*") // Cho phép ReactJS truy cập
public class AuthController {

    @Autowired
    private AuthService authService;

    // Chức năng Đăng ký
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        return ResponseEntity.ok(authService.register(user));
    }

    // Chức năng Đăng nhập [cite: 4, 9]
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        User user = authService.login(loginRequest.getUsername(), loginRequest.getPassword());
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body("Sai tài khoản hoặc mật khẩu");
    }

    // Cập nhật thông tin cá nhân
    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(authService.updateProfile(id, user));
    }
}
