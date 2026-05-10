package com.milo.server.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    @Column(nullable = false)
    private String categoryName;

    private String type; // "INCOME" (Thu nhập) hoặc "EXPENSE" (Chi tiêu) [cite: 5]

    private boolean isDefault = false; // Admin quản lý danh mục mặc định [cite: 8]
}
