package com.vynlotaste.repository;

import com.vynlotaste.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    
    List<Product> findByAvailableTrue();
    
    List<Product> findByNameContainingIgnoreCase(String name);
    
    Page<Product> findByAvailableTrue(Pageable pageable);
    
    List<Product> findByCategory(String category);
    
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= :threshold")
    List<Product> findByStockQuantityLessThanEqual(@Param("threshold") Integer threshold);
    
    List<Product> findByStockQuantityLessThan(Integer threshold);
}