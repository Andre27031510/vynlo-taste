package com.vynlotaste.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
// Lombok removido - usando getters/setters manuais
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Construtores e getters/setters manuais
@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_product_name", columnList = "name"),
    @Index(name = "idx_product_available", columnList = "available"),
    @Index(name = "idx_product_category", columnList = "category"),
    @Index(name = "idx_product_price", columnList = "price"),
    @Index(name = "idx_product_created_at", columnList = "created_at"),
    @Index(name = "idx_product_deleted", columnList = "deleted")
})
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE products SET deleted = true WHERE id = ?")
@SQLRestriction("deleted = false")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome do produto é obrigatório")
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    @Column(nullable = false, length = 100)
    private String name;

    @Size(max = 1000, message = "Descrição deve ter no máximo 1000 caracteres")
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Preço é obrigatório")
    @DecimalMin(value = "0.01", message = "Preço deve ser maior que zero")
    @DecimalMax(value = "9999.99", message = "Preço deve ser menor que R$ 9.999,99")
    @Digits(integer = 4, fraction = 2, message = "Preço deve ter no máximo 4 dígitos inteiros e 2 decimais")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Size(max = 500, message = "URL da imagem deve ter no máximo 500 caracteres")
    @Column(length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private Boolean available = true;

    @Min(value = 1, message = "Tempo de preparo deve ser pelo menos 1 minuto")
    @Max(value = 480, message = "Tempo de preparo deve ser no máximo 8 horas")
    private Integer preparationTime;

    @Min(value = 0, message = "Quantidade em estoque não pode ser negativa")
    @Column(nullable = false)
    private Integer stockQuantity = 0;

    @Size(max = 100, message = "Categoria deve ter no máximo 100 caracteres")
    @Column(length = 100)
    private String category;

    @Size(max = 500, message = "Ingredientes devem ter no máximo 500 caracteres")
    @Column(length = 500)
    private String ingredients;

    @DecimalMin(value = "0.0", message = "Peso não pode ser negativo")
    @DecimalMax(value = "99.99", message = "Peso deve ser menor que 100kg")
    @Column(precision = 4, scale = 2)
    private BigDecimal weight;

    @Min(value = 0, message = "Calorias não podem ser negativas")
    @Max(value = 9999, message = "Calorias devem ser menores que 10.000")
    private Integer calories;

    @Column(nullable = false)
    private Boolean vegan = false;

    @Column(nullable = false)
    private Boolean vegetarian = false;

    @Column(nullable = false)
    private Boolean glutenFree = false;

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
    public boolean isInStock() {
        return stockQuantity != null && stockQuantity > 0;
    }

    public boolean isAvailableForSale() {
        return available && !deleted && isInStock();
    }

    public void decreaseStock(int quantity) {
        if (stockQuantity >= quantity) {
            stockQuantity -= quantity;
        } else {
            throw new IllegalArgumentException("Estoque insuficiente");
        }
    }

    public void increaseStock(int quantity) {
        stockQuantity += quantity;
    }

    // Construtores
    public Product() {}

    public Product(String name, BigDecimal price, String category) {
        this.name = name;
        this.price = price;
        this.category = category;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }

    public Integer getPreparationTime() { return preparationTime; }
    public void setPreparationTime(Integer preparationTime) { this.preparationTime = preparationTime; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getIngredients() { return ingredients; }
    public void setIngredients(String ingredients) { this.ingredients = ingredients; }

    public BigDecimal getWeight() { return weight; }
    public void setWeight(BigDecimal weight) { this.weight = weight; }

    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }

    public Boolean getVegan() { return vegan; }
    public void setVegan(Boolean vegan) { this.vegan = vegan; }

    public Boolean getVegetarian() { return vegetarian; }
    public void setVegetarian(Boolean vegetarian) { this.vegetarian = vegetarian; }

    public Boolean getGlutenFree() { return glutenFree; }
    public void setGlutenFree(Boolean glutenFree) { this.glutenFree = glutenFree; }

    public Boolean getDeleted() { return deleted; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}