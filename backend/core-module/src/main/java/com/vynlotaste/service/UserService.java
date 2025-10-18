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

// Modified: 2025-10-14 20:35 UTC | createUser method enhanced with logging + cache eviction
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public User createUserFromFirebase(String email, String name) {
        log.info("Criando usuário Firebase: email={}, name={}", email, name);
        
        // Gerar username válido a partir do email
        String username = generateUsernameFromEmail(email);
        
        // Processar nome
        String firstName = "Usuário";
        String lastName = "Firebase";
        
        if (name != null && !name.trim().isEmpty()) {
            String[] nameParts = name.trim().split(" ");
            firstName = nameParts[0];
            if (nameParts.length > 1) {
                lastName = nameParts[nameParts.length - 1];
            }
        }
        
        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(UserRole.CUSTOMER);
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        // MULTI-TENANCY: Setar tenant_id automaticamente
        Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
        user.setTenantId(tenantId);
        log.debug("🔒 User Firebase será criado com tenant_id={}", tenantId);
        
        User savedUser = userRepository.save(user);
        log.info("Usuário Firebase criado com sucesso: id={}, email={}, username={}", 
                savedUser.getId(), savedUser.getEmail(), savedUser.getUsername());
        
        return savedUser;
    }
    
    private String generateUsernameFromEmail(String email) {
        log.info("Gerando username para email: {}", email);
        
        // Extrair parte antes do @ e limpar caracteres especiais
        String baseUsername = email.split("@")[0]
                .replaceAll("[^a-zA-Z0-9_]", "_")
                .toLowerCase();
        
        log.info("Username base após limpeza: {}", baseUsername);
        
        // Garantir que não comece com número
        if (baseUsername.matches("^[0-9].*")) {
            baseUsername = "user_" + baseUsername;
        }
        
        // Garantir que tenha pelo menos 3 caracteres
        if (baseUsername.length() < 3) {
            baseUsername = "user_" + baseUsername;
        }
        
        // Verificar se já existe e adicionar sufixo se necessário
        String finalUsername = baseUsername;
        int counter = 1;
        while (!isUsernameAvailable(finalUsername)) {
            finalUsername = baseUsername + "_" + counter;
            counter++;
        }
        
        log.info("Username final gerado: {}", finalUsername);
        return finalUsername;
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
        
        // MULTI-TENANCY: Setar tenant_id automaticamente
        Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
        user.setTenantId(tenantId);
        log.debug("🔒 User registrado será criado com tenant_id={}", tenantId);
        
        User savedUser = userRepository.save(user);
        log.info("Usuário registrado com sucesso: id={}, email={}", savedUser.getId(), savedUser.getEmail());
        
        return savedUser;
    }

    @Cacheable(value = CacheConfig.USERS_CACHE, key = "'email-available:' + #email + ':' + (#root.target.getCurrentTenantId() ?: 'super')")
    public boolean isEmailAvailable(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.isEmpty();
    }

    @Cacheable(value = CacheConfig.USERS_CACHE, key = "'username-available:' + #username + ':' + (#root.target.getCurrentTenantId() ?: 'super')")
    public boolean isUsernameAvailable(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.isEmpty();
    }
    
    @Cacheable(value = CacheConfig.USERS_CACHE, key = "'email:' + #email")
    public Optional<User> findByEmail(String email) {
        log.debug("Buscando usuário por email: {}", email);
        return userRepository.findByEmail(email);
    }

    @Cacheable(value = CacheConfig.USERS_CACHE, key = "'firebase:' + #firebaseUid")
    public Optional<User> findByFirebaseUid(String firebaseUid) {
        log.debug("Buscando usuário por Firebase UID: {}", firebaseUid);
        return userRepository.findByFirebaseUid(firebaseUid);
    }

    @Cacheable(value = CacheConfig.USERS_CACHE, key = "'id:' + #id + ':' + (#root.target.getCurrentTenantId() ?: 'super')")
    public User findById(Long id) {
        log.debug("Buscando usuário por ID: {}", id);
        return userRepository.findById(id)
            .orElseThrow(() -> new com.vynlotaste.exception.user.UserNotFoundException(id));
    }

    @Cacheable(value = CacheConfig.USERS_CACHE, key = "'active-users:' + (#root.target.getCurrentTenantId() ?: 'super')")
    public List<User> findActiveUsers() {
        // MULTI-TENANCY: Filtrar por tenant_id
        if (com.vynlotaste.context.TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: retornando TODOS os usuários ativos");
            return userRepository.findByActiveTrue();
        }
        
        Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - retornando lista vazia");
            return List.of();
        }
        log.debug("👤 Cliente (tenant_id={}): retornando usuários ativos do tenant", tenantId);
        return userRepository.findByActiveTrueAndTenantId(tenantId);
    }

    public Page<User> findAllUsers(Pageable pageable) {
        // MULTI-TENANCY: Filtrar por tenant_id
        if (com.vynlotaste.context.TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: retornando TODOS os usuários");
            return userRepository.findAll(pageable);
        }
        
        Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - retornando página vazia");
            return Page.empty(pageable);
        }
        log.debug("👤 Cliente (tenant_id={}): retornando usuários do tenant", tenantId);
        
        // Usar query otimizada do repository
        return userRepository.findAllByTenantId(tenantId, pageable);
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
        // MULTI-TENANCY: Usar método já corrigido
        return findAllUsers(pageable);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "users", allEntries = true),
        @CacheEvict(value = CacheConfig.USERS_CACHE, allEntries = true)
    })
    public User createUser(com.vynlotaste.dto.user.UserRequestDto userRequest) {
        log.info("📝 Criando usuário via API: email={}, username={}", userRequest.getEmail(), userRequest.getUsername());
        
        // Verificar se email já existe
        if (!isEmailAvailable(userRequest.getEmail())) {
            log.warn("⚠️ Email já existe: {}", userRequest.getEmail());
            throw new com.vynlotaste.exception.user.UserAlreadyExistsException("email", userRequest.getEmail());
        }
        
        // Verificar se username já existe
        if (!isUsernameAvailable(userRequest.getUsername())) {
            log.warn("⚠️ Username já existe: {}", userRequest.getUsername());
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

        // MULTI-TENANCY: Setar tenant_id automaticamente
        Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
        user.setTenantId(tenantId);
        log.debug("🔒 User criado com tenant_id={}", tenantId);

        User savedUser = userRepository.save(user);
        log.info("✅ Usuário criado com sucesso: ID={}, email={}, role={}", savedUser.getId(), savedUser.getEmail(), savedUser.getRole());
        
        return savedUser;
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

    public long count() {
        return userRepository.count();
    }

    public long countByActive(boolean active) {
        return userRepository.countByActive(active);
    }

    public long countActiveUsersLast24Hours() {
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        return userRepository.countByActiveAndLastActivityAtAfter(true, since);
    }

    public long countNewUsersToday() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        return userRepository.countByCreatedAtAfter(startOfDay);
    }

    @Cacheable(value = CacheConfig.USERS_CACHE, key = "'id:' + #id + ':' + (#root.target.getCurrentTenantId() ?: 'super')")
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
        // MULTI-TENANCY: Filtrar por tenant_id
        if (com.vynlotaste.context.TenantContext.isSuperAdmin()) {
            log.debug("🔑 Super Admin: retornando TODOS os usuários com role {}", role);
            return userRepository.findByRole(role);
        }
        
        Long tenantId = com.vynlotaste.context.TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            log.warn("⚠️ Tenant não definido - retornando lista vazia");
            return List.of();
        }
        log.debug("👤 Cliente (tenant_id={}): retornando usuários com role {} do tenant", tenantId, role);
        return userRepository.findByRoleAndTenantId(role, tenantId);
    }


    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public User save(User user) {
        log.debug("Salvando usuário: {}", user.getId());
        return userRepository.save(user);
    }
    
    /**
     * Método helper para cache - retorna tenant_id atual
     * Usado em @Cacheable key com SpEL: #root.target.getCurrentTenantId()
     */
    public Long getCurrentTenantId() {
        return com.vynlotaste.context.TenantContext.getCurrentTenantId();
    }
}
