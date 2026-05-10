package com.milo.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/transactions/**").hasAnyRole("USER", "ADMIN") // Cho phép cả 2 loại user vào đây
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults()); // Dòng này giúp Postman chạy được // Giữ lại để dùng cho các API khác sau khi đã login
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Trả về NoOpPasswordEncoder để báo rằng mật khẩu để dạng thuần (Plain Text)
        return org.springframework.security.crypto.password.NoOpPasswordEncoder.getInstance();
    }
}