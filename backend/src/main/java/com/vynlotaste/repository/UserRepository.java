package com.vynlotaste.repository;

import com.vynlotaste.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByCpf(String cpf);
    
    boolean existsByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByCpf(String cpf);

    @Query("SELECT u FROM User u WHERE u.active = true")
    List<User> findAllActive();

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.active = true")
    List<User> findByRoleAndActive(@Param("role") User.UserRole role);

    @Query("SELECT u FROM User u WHERE u.active = true AND (u.firstName LIKE %:search% OR u.lastName LIKE %:search% OR u.email LIKE %:search%)")
    Page<User> searchActiveUsers(@Param("search") String search, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.lastActivityAt < :threshold AND u.active = true")
    List<User> findInactiveUsers(@Param("threshold") LocalDateTime threshold);

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :startDate AND u.createdAt < :endDate")
    long countUsersCreatedBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT u.role, COUNT(u) FROM User u WHERE u.active = true GROUP BY u.role")
    List<Object[]> countUsersByRole();

    @Query("SELECT u FROM User u WHERE u.emailVerified = false AND u.createdAt < :threshold")
    List<User> findUnverifiedUsersOlderThan(@Param("threshold") LocalDateTime threshold);

    @Query("SELECT u FROM User u WHERE u.lastLoginAt IS NULL OR u.lastLoginAt < :threshold")
    List<User> findUsersNotLoggedInRecently(@Param("threshold") LocalDateTime threshold);
}