package com.vynlotaste.service;

import com.vynlotaste.config.CacheConfig;
import com.vynlotaste.dto.UserRegistrationDto;
import com.vynlotaste.entity.User;
import com.vynlotaste.entity.UserRole;
import com.vynlotaste.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
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
        user.setRole(UserRole.CUSTOMER);
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
        user.setRole(UserRole.CUSTOMER);
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        log.info("Usuário registrado com sucesso: id={}, email={}", savedUser.getId(), savedUser.getEmail());
        
        return savedUser;
    }

    @Cacheable(value = CacheConfig.USERS_CACHE, key = "'email-available:' + #email")
    public boolean isEmailAvailable(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.isEmpty();
    }

    @Cacheable(value = CacheConfig.USERS_CACHE, key = "'username-available:' + #username")
    public boolean isUsernameAvailable(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.isEmpty();
    }
    
    @Cacheable(value = CacheConfig.USERS_CACHE, key = "'email:' + #email")
    public Optional<User> findByEmail(String email) {
        log.debug("Buscando usuário por email: {}", email);
        return userRepository.findByEmail(email);
    }

    @Cacheable(value = CacheConfig.USERS_CACHE, key = "'id:' + #id")
    public User findById(Long id) {
        log.debug("Buscando usuário por ID: {}", id);
        return userRepository.findById(id)
            .orElseThrow(() -> new com.vynlotaste.exception.user.UserNotFoundException(id));
    }

    @Cacheable(value = CacheConfig.USERS_CACHE, key = "'active-users'")
    public List<User> findActiveUsers() {
        return userRepository.findByActiveTrue();
    }

    public Page<User> findAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Transactional
    @Caching(put = {
        @CachePut(value = CacheConfig.USERS_CACHE, key = "'id:' + #result.id"),
        @CachePut(value = CacheConfig.USERS_CACHE, key = "'email:' + #result.email")
    })
    public User updateUser(Long id, com.vynlotaste.dto.user.UserRequestDto userRequest) {
        User user = findById(id);
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setPhone(userRequest.getPhone());
        user.setAddress(userRequest.getAddress());
        user.setUpdatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);
        log.debug("Usuário atualizado e cache renovado: {}", savedUser.getId());
        return savedUser;
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = CacheConfig.USERS_CACHE, key = "'id:' + #id"),
        @CacheEvict(value = CacheConfig.USERS_CACHE, allEntries = true)
    })
    public void deleteUser(Long id) {
        User user = findById(id);
        userRepository.delete(user);
        log.debug("Usuário deletado e removido do cache: {}", id);
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public User activateUser(Long id) {
        User user = findById(id);
        user.setActive(true);
        return userRepository.save(user);
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public User deactivateUser(Long id) {
        User user = findById(id);
        user.setActive(false);
        return userRepository.save(user);
    }

    public org.springframework.data.domain.Page<User> findAll(org.springframework.data.domain.Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public User createUser(com.vynlotaste.dto.user.UserRequestDto userRequest) {
        // Verificar se email já existe
        if (!isEmailAvailable(userRequest.getEmail())) {
            throw new com.vynlotaste.exception.user.UserAlreadyExistsException("email", userRequest.getEmail());
        }
        
        // Verificar se username já existe
        if (!isUsernameAvailable(userRequest.getUsername())) {
            throw new com.vynlotaste.exception.user.UserAlreadyExistsException("username", userRequest.getUsername());
        }
        
        User user = new User();
        user.setEmail(userRequest.getEmail());
        user.setUsername(userRequest.getUsername());
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setPhone(userRequest.getPhone());
        user.setAddress(userRequest.getAddress());
        user.setCpf(userRequest.getCpf());
        user.setRole(userRequest.getRole() != null ? userRequest.getRole() : UserRole.CUSTOMER);
        user.setActive(userRequest.getActive() != null ? userRequest.getActive() : true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
    
    public Page<User> searchUsers(String query, org.springframework.data.domain.Pageable pageable) {
        // Implementação simples - pode ser melhorada com Specifications
        return userRepository.findAll(pageable);
    }
    
    public boolean isOwner(Long userId, String currentUserEmail) {
        try {
            User user = findById(userId);
            return user.getEmail().equals(currentUserEmail);
        } catch (Exception e) {
            return false;
        }
    }

    public long countActiveUsersLast24Hours() {
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        return userRepository.countByActiveAndLastActivityAtAfter(true, since);
    }

    public long countNewUsersToday() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        return userRepository.countByCreatedAtAfter(startOfDay);
    }

    @Cacheable(value = CacheConfig.USERS_CACHE, key = "'id:' + #id")
    public User getUserById(Long id) {
        return findById(id);
    }

    public Page<User> getAllUsers(Pageable pageable) {
        return findAllUsers(pageable);
    }

    public User getCurrentUserProfile() {
        // Este método deve ser implementado com base no contexto de segurança
        // Por enquanto, retorna null - deve ser implementado com Spring Security
        return null;
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public User toggleUserStatus(Long id) {
        User user = findById(id);
        user.setActive(!user.isActive());
        return userRepository.save(user);
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public void updatePassword(String email, String newPassword) {
        User user = findByEmail(email)
            .orElseThrow(() -> new com.vynlotaste.exception.user.UserNotFoundException("User not found with email: " + email));
        // Aqui você implementaria a lógica de hash da senha
        // user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }
}
