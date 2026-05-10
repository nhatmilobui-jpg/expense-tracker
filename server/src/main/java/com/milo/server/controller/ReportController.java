package com.milo.server.controller;

import com.milo.server.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
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
        List<Object[]> rows = transactionRepository.sumExpensesByMonth(userId, year);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> map = new HashMap<>();
            map.put("month", row[0]);
            map.put("total", row[1]);
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }
}
