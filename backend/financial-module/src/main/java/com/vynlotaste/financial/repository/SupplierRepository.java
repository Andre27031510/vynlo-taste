package com.vynlotaste.financial.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<com.vynlotaste.financial.Supplier, Long> {
}
