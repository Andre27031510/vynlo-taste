package com.vynlotaste.service;

import com.vynlotaste.dto.UserRegistrationDto;
import com.vynlotaste.entity.User;
import com.vynlotaste.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public User createUserFromFirebase(String email, String name) {
        log.info("Criando usuário Firebase: email={}, name={}", email, name);
        
        User user = new User();
        user.setEmail(email);
        user.setUsername(email);
        user.setFirstName(name != null ? name.split(" ")[0] : "");
        user.setLastName(name != null && name.split(" ").length > 1 ? name.split(" ")[1] : "");
        user.setRole(User.UserRole.CUSTOMER);
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        log.info("Usuário Firebase criado com sucesso: id={}, email={}", savedUser.getId(), savedUser.getEmail());
        
        return savedUser;
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public User createUserFromRegistration(UserRegistrationDto registrationDto) {
        log.info("Criando usuário por registro: email={}, username={}", 
                registrationDto.getEmail(), registrationDto.getUsername());
        
        User user = new User();
        user.setEmail(registrationDto.getEmail());
        user.setUsername(registrationDto.getUsername());
        user.setFirstName(registrationDto.getFirstName());
        user.setLastName(registrationDto.getLastName());
        user.setPhone(registrationDto.getPhone());
        user.setAddress(registrationDto.getAddress());
        user.setCpf(registrationDto.getCpf());
        user.setRole(User.UserRole.CUSTOMER);
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        log.info("Usuário registrado com sucesso: id={}, email={}", savedUser.getId(), savedUser.getEmail());
        
        return savedUser;
    }

    @Cacheable(value = "users", key = "'email:' + #email")
    public boolean isEmailAvailable(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.isEmpty();
    }

    @Cacheable(value = "users", key = "'username:' + #username")
    public boolean isUsernameAvailable(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.isEmpty();
    }
    
    @Cacheable(value = "users", key = "'user:' + #email")
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
