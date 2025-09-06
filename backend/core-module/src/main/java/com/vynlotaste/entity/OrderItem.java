package com.vynlotaste.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
// Lombok removido - usando getters/setters manuais
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Construtores e getters/setters manuais
@Entity
@Table(name = "order_items", indexes = {
    @Index(name = "idx_order_item_order", columnList = "order_id"),
    @Index(name = "idx_order_item_product", columnList = "product_id"),
    @Index(name = "idx_order_item_deleted", columnList = "deleted")
})
@SQLDelete(sql = "UPDATE order_items SET deleted = true WHERE id = ?")
@SQLRestriction("deleted = false")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Pedido é obrigatório")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @NotNull(message = "Produto é obrigatório")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull(message = "Quantidade é obrigatória")
    @Min(value = 1, message = "Quantidade deve ser pelo menos 1")
    @Max(value = 99, message = "Quantidade deve ser no máximo 99")
    @Column(nullable = false)
    private Integer quantity;

    @NotNull(message = "Preço unitário é obrigatório")
    @DecimalMin(value = "0.01", message = "Preço unitário deve ser maior que zero")
    @DecimalMax(value = "9999.99", message = "Preço unitário deve ser menor que R$ 9.999,99")
    @Digits(integer = 4, fraction = 2, message = "Preço deve ter no máximo 4 dígitos inteiros e 2 decimais")
    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Size(max = 300, message = "Observações do item devem ter no máximo 300 caracteres")
    @Column(name = "item_notes", length = 300)
    private String itemNotes;

    @Size(max = 1000, message = "Personalizações devem ter no máximo 1000 caracteres")
    @Column(columnDefinition = "TEXT")
    private String customizations;

    @Column(nullable = false)
    private Boolean deleted = false;

    @Version
    private Long version;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Métodos de negócio
    public BigDecimal getTotalPrice() {
        return unitPrice.multiply(BigDecimal.valueOf(quantity));
    }

    public String getProductName() {
        return product != null ? product.getName() : null;
    }

    // Construtores
    public OrderItem() {}

    public OrderItem(Order order, Product product, Integer quantity, BigDecimal unitPrice) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public String getItemNotes() { return itemNotes; }
    public void setItemNotes(String itemNotes) { this.itemNotes = itemNotes; }

    public String getCustomizations() { return customizations; }
    public void setCustomizations(String customizations) { this.customizations = customizations; }

    public Boolean getDeleted() { return deleted; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}