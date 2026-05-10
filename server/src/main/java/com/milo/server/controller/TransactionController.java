package com.milo.server.controller;

import com.milo.server.entity.Category;
import com.milo.server.entity.Transaction;
import com.milo.server.repository.CategoryRepository;
import com.milo.server.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private CategoryRepository categoryRepository;

    // 1. Lấy danh sách danh mục để người dùng chọn khi thêm chi tiêu
    @GetMapping("/categories")
    public List<Category> getCategories() {
        return categoryRepository.findAll();
    }

    // 2. Lấy toàn bộ giao dịch của người dùng
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Transaction>> getTransactions(@PathVariable Long userId) {
        return ResponseEntity.ok(transactionService.getAllByUserId(userId));
    }

    // 3. Thêm khoản chi tiêu/thu nhập mới [cite: 5, 11]
    @PostMapping
    public ResponseEntity<Transaction> create(@RequestBody Transaction transaction) {
        return ResponseEntity.ok(transactionService.saveTransaction(transaction));
    }

    // 4. Cập nhật khoản chi tiêu
    @PutMapping("/{id}")
    public ResponseEntity<Transaction> update(@PathVariable Long id, @RequestBody Transaction transaction) {
        transaction.setTransactionId(id);
        return ResponseEntity.ok(transactionService.saveTransaction(transaction));
    }

    // 5. Xóa khoản chi tiêu
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok("Đã xóa thành công");
    }
}
