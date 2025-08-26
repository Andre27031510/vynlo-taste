package com.vynlotaste.financial;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entidade principal do restaurante no sistema Vynlo Taste
 * Gerencia informações básicas, configurações e relacionamentos
 */
@Entity
@Table(name = "restaurants", 
       indexes = {
           @Index(name = "idx_restaurant_cnpj", columnList = "cnpj"),
           @Index(name = "idx_restaurant_name", columnList = "name"),
           @Index(name = "idx_restaurant_status", columnList = "status")
       })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome do restaurante é obrigatório")
    @Size(min = 2, max = 200, message = "Nome deve ter entre 2 e 200 caracteres")
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "CNPJ é obrigatório")
    @Size(min = 14, max = 18, message = "CNPJ deve ter entre 14 e 18 caracteres")
    @Column(name = "cnpj", unique = true, nullable = false)
    private String cnpj;

    @Column(name = "inscricao_estadual")
    private String inscricaoEstadual;

    @Column(name = "inscricao_municipal")
    private String inscricaoMunicipal;

    @Column(name = "razao_social")
    private String razaoSocial;

    @Column(name = "nome_fantasia")
    private String nomeFantasia;

    @Column(name = "phone")
    private String phone;

    @Column(name = "whatsapp")
    private String whatsapp;

    @Column(name = "email")
    private String email;

    @Column(name = "website")
    private String website;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "banner_url")
    private String bannerUrl;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private RestaurantCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RestaurantStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private RestaurantType type;

    @Column(name = "delivery_enabled")
    private Boolean deliveryEnabled;

    @Column(name = "takeaway_enabled")
    private Boolean takeawayEnabled;

    @Column(name = "dine_in_enabled")
    private Boolean dineInEnabled;

    @Column(name = "delivery_radius_km")
    private Double deliveryRadiusKm;

    @Column(name = "delivery_fee")
    private BigDecimal deliveryFee;

    @Column(name = "minimum_order_amount")
    private BigDecimal minimumOrderAmount;

    @Column(name = "average_preparation_time_minutes")
    private Integer averagePreparationTimeMinutes;

    @Column(name = "opening_time")
    private LocalTime openingTime;

    @Column(name = "closing_time")
    private LocalTime closingTime;

    @Column(name = "working_days", columnDefinition = "TEXT")
    private String workingDays; // JSON array de dias da semana

    @Column(name = "holidays", columnDefinition = "TEXT")
    private String holidays; // JSON array de feriados

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "zip_code")
    private String zipCode;

    @Column(name = "country")
    private String country;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "rating")
    private BigDecimal rating;

    @Column(name = "total_reviews")
    private Integer totalReviews;

    @Column(name = "commission_rate")
    private BigDecimal commissionRate;

    @Column(name = "tax_rate")
    private BigDecimal taxRate;

    @Column(name = "currency")
    private String currency;

    @Column(name = "timezone")
    private String timezone;

    @Column(name = "language")
    private String language;

    @Column(name = "settings", columnDefinition = "TEXT")
    private String settings; // JSON com configurações específicas

    @Column(name = "features", columnDefinition = "TEXT")
    private String features; // JSON array de funcionalidades disponíveis

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "deleted_by")
    private Long deletedBy;

    @Column(name = "active", nullable = false)
    private Boolean active;

    // Relacionamentos
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<User> users = new HashSet<>();

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Menu> menus = new HashSet<>();

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Order> orders = new HashSet<>();

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<FinancialAccount> financialAccounts = new HashSet<>();

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<RestaurantSchedule> schedules = new HashSet<>();

    // Métodos de negócio
    public boolean isOpen() {
        if (status != RestaurantStatus.ACTIVE) return false;
        
        LocalDateTime now = LocalDateTime.now();
        LocalTime currentTime = now.toLocalTime();
        
        return currentTime.isAfter(openingTime) && currentTime.isBefore(closingTime);
    }

    public boolean isWorkingDay() {
        // Implementar lógica para verificar se é dia útil
        return true; // Placeholder
    }

    public boolean acceptsDelivery() {
        return deliveryEnabled && status == RestaurantStatus.ACTIVE;
    }

    public boolean acceptsTakeaway() {
        return takeawayEnabled && status == RestaurantStatus.ACTIVE;
    }

    public boolean acceptsDineIn() {
        return dineInEnabled && status == RestaurantStatus.ACTIVE;
    }

    public BigDecimal calculateDeliveryFee(BigDecimal orderAmount) {
        if (!deliveryEnabled) return BigDecimal.ZERO;
        if (orderAmount.compareTo(minimumOrderAmount) >= 0) {
            return deliveryFee;
        }
        return deliveryFee.add(BigDecimal.valueOf(5.0)); // Taxa adicional para pedidos pequenos
    }

    // Enums
    public enum RestaurantStatus {
        ACTIVE, INACTIVE, SUSPENDED, PENDING_APPROVAL, CLOSED_TEMPORARILY
    }

    public enum RestaurantType {
        RESTAURANT, FAST_FOOD, PIZZARIA, BAR, CAFE, BAKERY, FOOD_TRUCK, CATERING
    }

    public enum RestaurantCategory {
        BRAZILIAN, ITALIAN, JAPANESE, CHINESE, MEXICAN, AMERICAN, ARABIC, INDIAN, 
        VEGETARIAN, VEGAN, GLUTEN_FREE, HEALTHY, GOURMET, STREET_FOOD, FUSION
    }
}
