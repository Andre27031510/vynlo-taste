package com.vynlotaste.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Entidade Driver - Motoboys/Entregadores
 * Commit feb97aa: Removido columnDefinition que causava conflito com Flyway
 * Migration V10 gerencia estrutura do banco (precision, scale, defaults)
 * Fix c3ba285: Removido precision/scale de Double (só funciona com BigDecimal)
 */
@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "phone", nullable = false, unique = true)
    private String phone;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "cpf", length = 14)
    private String cpf;

    @Column(name = "cnh", length = 20)
    private String cnh;

    @Column(name = "vehicle", nullable = false)
    private String vehicle;

    @Column(name = "plate", nullable = false)
    private String plate;

    @Column(name = "address", length = 500)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DriverStatus status = DriverStatus.OFFLINE;

    @Column(name = "rating")
    private Double rating = 0.0;

    @Column(name = "total_deliveries")
    private Integer totalDeliveries = 0;

    @Column(name = "last_active")
    private LocalDateTime lastActive;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum DriverStatus {
        AVAILABLE,
        BUSY,
        OFFLINE
    }
}

