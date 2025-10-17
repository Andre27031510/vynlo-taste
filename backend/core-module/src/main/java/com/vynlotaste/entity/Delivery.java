package com.vynlotaste.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "customer_phone", nullable = false)
    private String customerPhone;

    @Column(name = "delivery_address", nullable = false, length = 500)
    private String deliveryAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DeliveryStatus status = DeliveryStatus.PREPARING;

    @Enumerated(EnumType.STRING)
    @Column(name = "source", nullable = false)
    private DeliverySource source = DeliverySource.WEBSITE;

    @Column(name = "estimated_time")
    private String estimatedTime;

    @Column(name = "distance")
    private String distance;

    @Column(name = "driver_location")
    private String driverLocation;

    @Column(name = "notes", length = 1000)
    private String notes;

    /**
     * Multi-Tenancy: ID do tenant (restaurante/empresa) dono desta entrega
     * NULL = Super Admin (acesso global)
     * NOT NULL = Cliente específico (entregas isoladas)
     */
    @Column(name = "tenant_id")
    private Long tenantId;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "last_update")
    private LocalDateTime lastUpdate;

    public enum DeliveryStatus {
        PREPARING,
        IN_TRANSIT,
        ARRIVED,
        DELIVERED,
        PROBLEM,
        CANCELLED
    }

    public enum DeliverySource {
        WHATSAPP,
        IFOOD,
        BALCAO,
        WEBSITE
    }
}

