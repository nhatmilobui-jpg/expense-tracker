package com.milo.server.config;

import com.milo.server.entity.Category;
import com.milo.server.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedCategories(CategoryRepository categoryRepository) {
        return args -> {
            if (categoryRepository.count() == 0) {
                categoryRepository.save(new Category(null, "Luong thang", "INCOME", true));
                categoryRepository.save(new Category(null, "Thuong", "INCOME", true));
                categoryRepository.save(new Category(null, "Dau tu", "INCOME", true));
                categoryRepository.save(new Category(null, "An uong", "EXPENSE", true));
                categoryRepository.save(new Category(null, "Di lai", "EXPENSE", true));
                categoryRepository.save(new Category(null, "Mua sam", "EXPENSE", true));
                categoryRepository.save(new Category(null, "Hoa don", "EXPENSE", true));
                categoryRepository.save(new Category(null, "Giai tri", "EXPENSE", true));
                categoryRepository.save(new Category(null, "Y te", "EXPENSE", true));
                categoryRepository.save(new Category(null, "Hoc tap", "EXPENSE", true));
                categoryRepository.save(new Category(null, "Khac", "EXPENSE", true));
            }
        };
    }
}
