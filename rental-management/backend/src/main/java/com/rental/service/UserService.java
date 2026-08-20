package com.rental.service;

import com.rental.dto.UserDto;
import com.rental.entity.User;
import com.rental.exception.ResourceNotFoundException;
import com.rental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(Long id) {
        User user = findEntityById(id);
        return UserDto.fromEntity(user);
    }

    public List<UserDto> getTenants() {
        return userRepository.findByRole(User.Role.TENANT)
                .stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    public UserDto updateUser(Long id, UserDto dto) {
        User user = findEntityById(id);
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        return UserDto.fromEntity(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id))
            throw new ResourceNotFoundException("User not found: " + id);
        userRepository.deleteById(id);
    }

    // Internal helper — returns raw entity for use within service layer only
    public User findEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }
}
