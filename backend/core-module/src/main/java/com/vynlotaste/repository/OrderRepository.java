package com.vynlotaste.repository;

import com.vynlotaste.entity.Order;
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

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    
    @EntityGraph(attributePaths = {"customer", "status", "type"})
    List<Order> findByCustomerId(Long customerId);
    
    @EntityGraph(attributePaths = {"customer", "type"})
    List<Order> findByStatus(Order.OrderStatus status);
    
    @EntityGraph(attributePaths = {"customer", "status", "type"})
    Order findByOrderNumber(String orderNumber);
    
    @EntityGraph(attributePaths = {"customer", "status", "type"})
    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT o FROM Order o WHERE o.createdAt >= :since ORDER BY o.createdAt DESC")
    @EntityGraph(attributePaths = {"customer", "status", "type"})
    List<Order> findByCreatedAtAfterOrderByCreatedAtDesc(@Param("since") LocalDateTime since);
    
    @Query("SELECT o FROM Order o WHERE o.status IN :statuses")
    @EntityGraph(attributePaths = {"customer", "type"})
    Page<Order> findByStatusIn(@Param("statuses") List<Order.OrderStatus> statuses, Pageable pageable);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status AND o.createdAt >= :since")
    long countByStatusAndCreatedAtAfter(@Param("status") Order.OrderStatus status, @Param("since") LocalDateTime since);
    
    long countByStatus(Order.OrderStatus status);
    
    long countByCreatedAtAfter(LocalDateTime since);
    
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.createdAtAfter >= :since")
    java.math.BigDecimal sumTotalAmountByCreatedAtAfter(@Param("since") LocalDateTime since);
}