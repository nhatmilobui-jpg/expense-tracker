package com.milo.server.service;

import com.milo.server.entity.User;
import com.milo.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Tìm user trong DB
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng: " + username));

        // Trả về đối tượng UserDetails mà Spring Security hiểu được
        return org.springframework.security.core.userdetails.User.withUsername(user.getUsername())
                .password("{noop}" + user.getPassword()) // {noop} để báo là mật khẩu KHÔNG mã hóa theo SRS
                .roles(user.getRole()) // Phân quyền USER/ADMIN
                .build();
    }
}