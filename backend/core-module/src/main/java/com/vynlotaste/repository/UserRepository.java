package com.vynlotaste.repository;

import com.vynlotaste.entity.User;
import com.vynlotaste.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * UserRepository - Multi-Tenancy Support
 * IMPORTANTE: Queries globais + queries filtradas por tenant_id
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    
    // ============================================================================
    // QUERIES GLOBAIS (APENAS SUPER ADMIN - sem filtro tenant_id)
    // ============================================================================
    
    @EntityGraph(attributePaths = {"role"})
    Optional<User> findByEmail(String email);
    
    @EntityGraph(attributePaths = {"role"})
    Optional<User> findByUsername(String username);
    
    @EntityGraph(attributePaths = {"role"})
    Optional<User> findByFirebaseUid(String firebaseUid);
    
    @EntityGraph(attributePaths = {"role"})
    List<User> findByActiveTrue();
    
    @Query("SELECT u FROM User u WHERE u.active = true AND u.role = :role")
    @EntityGraph(attributePaths = {"role"})
    List<User> findActiveUsersByRole(@Param("role") UserRole role);
    
    @EntityGraph(attributePaths = {"role"})
    List<User> findByRole(UserRole role);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.active = true")
    long countActiveUsers();
    
    long countByActive(boolean active);
    
    long countByActiveAndLastActivityAtAfter(boolean active, LocalDateTime since);
    
    long countByCreatedAtAfter(LocalDateTime since);
    
    // ============================================================================
    // MULTI-TENANCY: Queries com filtro de tenant_id
    // ============================================================================
    
    @Query("SELECT u FROM User u WHERE u.tenantId = :tenantId")
    @EntityGraph(attributePaths = {"role"})
    Page<User> findAllByTenantId(@Param("tenantId") Long tenantId, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.tenantId = :tenantId AND u.active = true")
    @EntityGraph(attributePaths = {"role"})
    List<User> findByActiveTrueAndTenantId(@Param("tenantId") Long tenantId);
    
    @Query("SELECT u FROM User u WHERE u.tenantId = :tenantId AND u.role = :role")
    @EntityGraph(attributePaths = {"role"})
    List<User> findByRoleAndTenantId(@Param("role") UserRole role, @Param("tenantId") Long tenantId);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.tenantId = :tenantId AND u.active = true")
    long countByActiveTrueAndTenantId(@Param("tenantId") Long tenantId);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.tenantId = :tenantId")
    long countByTenantId(@Param("tenantId") Long tenantId);
    
    // ============================================================================
    // VALIDAÇÃO DE UNICIDADE POR TENANT (LGPD Art. 46)
    // ============================================================================
    
    /**
     * Verifica se email já existe no tenant específico
     * Usado para validação ANTES de criar usuário
     */
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.tenantId = :tenantId")
    @EntityGraph(attributePaths = {"role"})
    Optional<User> findByEmailAndTenantId(@Param("email") String email, @Param("tenantId") Long tenantId);
    
    /**
     * Verifica se username já existe no tenant específico
     * Usado para validação ANTES de criar usuário
     */
    @Query("SELECT u FROM User u WHERE u.username = :username AND u.tenantId = :tenantId")
    @EntityGraph(attributePaths = {"role"})
    Optional<User> findByUsernameAndTenantId(@Param("username") String username, @Param("tenantId") Long tenantId);
}