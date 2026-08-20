package com.rental.config;

import com.rental.entity.User;
import com.rental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUser("admin",   "admin123",   "admin@rentpro.com",   "System Administrator", "+1-555-0100", User.Role.ADMIN);
        seedUser("manager", "manager123", "manager@rentpro.com", "Property Manager",     "+1-555-0101", User.Role.MANAGER);
        seedUser("tenant1", "tenant123",  "tenant1@rentpro.com", "John Tenant",          "+1-555-0200", User.Role.TENANT);
        System.out.println("✅ Default users seeded successfully.");
        System.out.println("   admin / admin123");
        System.out.println("   manager / manager123");
        System.out.println("   tenant1 / tenant123");
    }

    private void seedUser(String username, String password, String email,
                          String fullName, String phone, User.Role role) {
        if (userRepository.existsByUsername(username)) return; // skip if already exists

        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .email(email)
                .fullName(fullName)
                .phone(phone)
                .role(role)
                .build();

        userRepository.save(user);
    }
}
