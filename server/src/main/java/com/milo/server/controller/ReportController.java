package com.milo.server.controller;

import com.milo.server.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin("*")
public class ReportController {

    @Autowired
    private TransactionRepository transactionRepository;

    // API lấy dữ liệu biểu đồ tròn: Phân bổ chi tiêu theo loại [cite: 12]
    @GetMapping("/category-distribution/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getCategoryDistribution(@PathVariable Long userId) {
        return ResponseEntity.ok(transactionRepository.sumExpensesByCategory(userId));
    }

    // API lấy dữ liệu biểu đồ cột: So sánh chi tiêu qua các tháng [cite: 6]
    @GetMapping("/monthly-comparison/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyComparison(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "2026") int year) {
        return ResponseEntity.ok(transactionRepository.sumExpensesByMonth(userId, year));
    }
}
