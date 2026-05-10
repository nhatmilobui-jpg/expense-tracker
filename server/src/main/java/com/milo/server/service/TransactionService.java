package com.milo.server.service;

import com.milo.server.entity.Transaction;
import com.milo.server.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> getAllByUserId(Long userId) {
        return transactionRepository.findByUser_UserIdOrderByTransactionDateDesc(userId);
    }

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction); // Thêm hoặc Sửa
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id); // Xóa
    }
}