package com.vynlotaste.specification;

import com.vynlotaste.entity.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ProductSpecifications {

    public static Specification<Product> hasCategory(String category) {
        return (root, query, criteriaBuilder) -> 
            category == null || category.trim().isEmpty() ? null : 
            criteriaBuilder.equal(criteriaBuilder.lower(root.get("category")), category.toLowerCase());
    }

    public static Specification<Product> isAvailable(Boolean available) {
        return (root, query, criteriaBuilder) -> 
            available == null ? null : criteriaBuilder.equal(root.get("available"), available);
    }

    public static Specification<Product> priceGreaterThan(BigDecimal minPrice) {
        return (root, query, criteriaBuilder) -> 
            minPrice == null ? null : criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    public static Specification<Product> priceLessThan(BigDecimal maxPrice) {
        return (root, query, criteriaBuilder) -> 
            maxPrice == null ? null : criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
    }

    public static Specification<Product> priceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minPrice == null && maxPrice == null) return null;
            if (minPrice == null) return criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
            if (maxPrice == null) return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
            return criteriaBuilder.between(root.get("price"), minPrice, maxPrice);
        };
    }

    public static Specification<Product> hasNameContaining(String name) {
        return (root, query, criteriaBuilder) -> 
            name == null || name.trim().isEmpty() ? null : 
            criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Product> hasDescriptionContaining(String description) {
        return (root, query, criteriaBuilder) -> 
            description == null || description.trim().isEmpty() ? null : 
            criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), "%" + description.toLowerCase() + "%");
    }

    public static Specification<Product> stockGreaterThan(Integer minStock) {
        return (root, query, criteriaBuilder) -> 
            minStock == null ? null : criteriaBuilder.greaterThanOrEqualTo(root.get("stockQuantity"), minStock);
    }

    public static Specification<Product> stockLessThan(Integer maxStock) {
        return (root, query, criteriaBuilder) -> 
            maxStock == null ? null : criteriaBuilder.lessThanOrEqualTo(root.get("stockQuantity"), maxStock);
    }

    public static Specification<Product> isInStock() {
        return (root, query, criteriaBuilder) -> 
            criteriaBuilder.greaterThan(root.get("stockQuantity"), 0);
    }

    public static Specification<Product> isOutOfStock() {
        return (root, query, criteriaBuilder) -> 
            criteriaBuilder.equal(root.get("stockQuantity"), 0);
    }

    public static Specification<Product> isVegan(Boolean vegan) {
        return (root, query, criteriaBuilder) -> 
            vegan == null ? null : criteriaBuilder.equal(root.get("vegan"), vegan);
    }

    public static Specification<Product> isVegetarian(Boolean vegetarian) {
        return (root, query, criteriaBuilder) -> 
            vegetarian == null ? null : criteriaBuilder.equal(root.get("vegetarian"), vegetarian);
    }

    public static Specification<Product> isGlutenFree(Boolean glutenFree) {
        return (root, query, criteriaBuilder) -> 
            glutenFree == null ? null : criteriaBuilder.equal(root.get("glutenFree"), glutenFree);
    }

    public static Specification<Product> createdAfter(LocalDateTime date) {
        return (root, query, criteriaBuilder) -> 
            date == null ? null : criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), date);
    }

    public static Specification<Product> preparationTimeLessThan(Integer maxTime) {
        return (root, query, criteriaBuilder) -> 
            maxTime == null ? null : criteriaBuilder.lessThanOrEqualTo(root.get("preparationTime"), maxTime);
    }

    public static Specification<Product> hasIngredientsContaining(String ingredient) {
        return (root, query, criteriaBuilder) -> 
            ingredient == null || ingredient.trim().isEmpty() ? null : 
            criteriaBuilder.like(criteriaBuilder.lower(root.get("ingredients")), "%" + ingredient.toLowerCase() + "%");
    }

    public static Specification<Product> buildDynamicQuery(String category, Boolean available, 
                                                          BigDecimal minPrice, BigDecimal maxPrice,
                                                          String nameContains, String descriptionContains,
                                                          Integer minStock, Boolean vegan, Boolean vegetarian,
                                                          Boolean glutenFree, String ingredientContains) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (category != null && !category.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(
                    criteriaBuilder.lower(root.get("category")), 
                    category.toLowerCase()
                ));
            }

            if (available != null) {
                predicates.add(criteriaBuilder.equal(root.get("available"), available));
            }

            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            if (nameContains != null && !nameContains.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("name")), 
                    "%" + nameContains.toLowerCase() + "%"
                ));
            }

            if (descriptionContains != null && !descriptionContains.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("description")), 
                    "%" + descriptionContains.toLowerCase() + "%"
                ));
            }

            if (minStock != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("stockQuantity"), minStock));
            }

            if (vegan != null) {
                predicates.add(criteriaBuilder.equal(root.get("vegan"), vegan));
            }

            if (vegetarian != null) {
                predicates.add(criteriaBuilder.equal(root.get("vegetarian"), vegetarian));
            }

            if (glutenFree != null) {
                predicates.add(criteriaBuilder.equal(root.get("glutenFree"), glutenFree));
            }

            if (ingredientContains != null && !ingredientContains.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("ingredients")), 
                    "%" + ingredientContains.toLowerCase() + "%"
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}