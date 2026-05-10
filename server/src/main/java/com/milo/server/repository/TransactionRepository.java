package com.milo.server.repository;

import com.milo.server.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Map;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // 1. Lấy danh sách giao dịch theo UserId để hiển thị trang chính [cite: 6, 10]
    List<Transaction> findByUser_UserIdOrderByTransactionDateDesc(Long userId);

    // 2. Thống kê chi tiêu theo từng nhóm cho biểu đồ tròn [cite: 6, 12]
    @Query("SELECT t.category.categoryName as name, SUM(t.amount) as value " +
            "FROM Transaction t " +
            "WHERE t.user.userId = :userId AND t.category.type = 'EXPENSE' " +
            "GROUP BY t.category.categoryName")
    List<Map<String, Object>> sumExpensesByCategory(@Param("userId") Long userId);

    // 3. So sánh chi tiêu qua các tháng cho biểu đồ cột [cite: 6, 12]
    @Query(value = "SELECT EXTRACT(MONTH FROM transaction_date) as month, SUM(amount) as total " +
            "FROM transactions " +
            "WHERE user_id = :userId AND EXTRACT(YEAR FROM transaction_date) = :year " +
            "GROUP BY month ORDER BY month", nativeQuery = true)
    List<Map<String, Object>> sumExpensesByMonth(@Param("userId") Long userId, @Param("year") int year);

    // 4. Thống kê toàn hệ thống dành cho Admin [cite: 9]
    @Query("SELECT t.category.type as type, SUM(t.amount) as total " +
            "FROM Transaction t GROUP BY t.category.type")
    List<Map<String, Object>> sumSystemWideTransactions();
}