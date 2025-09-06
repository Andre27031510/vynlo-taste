package com.vynlotaste.repository;

import com.vynlotaste.entity.User;
import com.vynlotaste.entity.UserRole;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    
    @EntityGraph(attributePaths = {"role"})
    Optional<User> findByEmail(String email);
    
    @EntityGraph(attributePaths = {"role"})
    Optional<User> findByUsername(String username);
    
    @EntityGraph(attributePaths = {"role"})
    List<User> findByActiveTrue();
    
    @Query("SELECT u FROM User u WHERE u.active = true AND u.role = :role")
    @EntityGraph(attributePaths = {"role"})
    List<User> findActiveUsersByRole(@Param("role") UserRole role);
    
    @EntityGraph(attributePaths = {"role"})
    List<User> findByRole(UserRole role);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.active = true")
    long countActiveUsers();
    
    long countByActiveAndLastActivityAtAfter(boolean active, LocalDateTime since);
    
    long countByCreatedAtAfter(LocalDateTime since);
}