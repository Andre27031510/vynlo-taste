package com.vynlotaste.repository;

import com.vynlotaste.entity.Delivery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    
    List<Delivery> findByStatus(Delivery.DeliveryStatus status);
    
    Page<Delivery> findByStatus(Delivery.DeliveryStatus status, Pageable pageable);
    
    List<Delivery> findByDriverId(Long driverId);
    
    List<Delivery> findByOrderId(Long orderId);
    
    @Query("SELECT d FROM Delivery d WHERE d.createdAt >= :since ORDER BY d.createdAt DESC")
    List<Delivery> findRecentDeliveries(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(d) FROM Delivery d WHERE d.status = :status")
    long countByStatus(@Param("status") Delivery.DeliveryStatus status);
    
    @Query("SELECT d FROM Delivery d WHERE " +
           "LOWER(d.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.customerPhone) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Delivery> searchDeliveries(@Param("search") String search, Pageable pageable);
}

