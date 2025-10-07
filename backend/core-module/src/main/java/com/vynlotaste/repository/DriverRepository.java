package com.vynlotaste.repository;

import com.vynlotaste.entity.Driver;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    
    Optional<Driver> findByPhone(String phone);
    
    Optional<Driver> findByEmail(String email);
    
    List<Driver> findByStatus(Driver.DriverStatus status);
    
    Page<Driver> findByStatus(Driver.DriverStatus status, Pageable pageable);
    
    @Query("SELECT COUNT(d) FROM Driver d WHERE d.status = :status")
    long countByStatus(@Param("status") Driver.DriverStatus status);
    
    @Query("SELECT AVG(d.rating) FROM Driver d")
    Double getAverageRating();
    
    @Query("SELECT d FROM Driver d WHERE " +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.phone) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.plate) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Driver> searchDrivers(@Param("search") String search, Pageable pageable);
    
    boolean existsByPhone(String phone);
    
    boolean existsByEmail(String email);
}

