package com.vynlotaste.specification;

import com.vynlotaste.entity.Order;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrderSpecifications {

    public static Specification<Order> hasStatus(Order.OrderStatus status) {
        return (root, query, criteriaBuilder) -> 
            status == null ? null : criteriaBuilder.equal(root.get("status"), status);
    }

    public static Specification<Order> hasType(Order.OrderType type) {
        return (root, query, criteriaBuilder) -> 
            type == null ? null : criteriaBuilder.equal(root.get("type"), type);
    }

    public static Specification<Order> hasCustomerId(Long customerId) {
        return (root, query, criteriaBuilder) -> 
            customerId == null ? null : criteriaBuilder.equal(root.get("customer").get("id"), customerId);
    }

    public static Specification<Order> hasCustomerEmail(String email) {
        return (root, query, criteriaBuilder) -> 
            email == null || email.trim().isEmpty() ? null : 
            criteriaBuilder.like(criteriaBuilder.lower(root.get("customer").get("email")), "%" + email.toLowerCase() + "%");
    }

    public static Specification<Order> createdAfter(LocalDateTime date) {
        return (root, query, criteriaBuilder) -> 
            date == null ? null : criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), date);
    }

    public static Specification<Order> createdBefore(LocalDateTime date) {
        return (root, query, criteriaBuilder) -> 
            date == null ? null : criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), date);
    }

    public static Specification<Order> createdBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return (root, query, criteriaBuilder) -> {
            if (startDate == null && endDate == null) return null;
            if (startDate == null) return criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), endDate);
            if (endDate == null) return criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), startDate);
            return criteriaBuilder.between(root.get("createdAt"), startDate, endDate);
        };
    }

    public static Specification<Order> totalAmountGreaterThan(BigDecimal minAmount) {
        return (root, query, criteriaBuilder) -> 
            minAmount == null ? null : criteriaBuilder.greaterThanOrEqualTo(root.get("totalAmount"), minAmount);
    }

    public static Specification<Order> totalAmountLessThan(BigDecimal maxAmount) {
        return (root, query, criteriaBuilder) -> 
            maxAmount == null ? null : criteriaBuilder.lessThanOrEqualTo(root.get("totalAmount"), maxAmount);
    }

    public static Specification<Order> totalAmountBetween(BigDecimal minAmount, BigDecimal maxAmount) {
        return (root, query, criteriaBuilder) -> {
            if (minAmount == null && maxAmount == null) return null;
            if (minAmount == null) return criteriaBuilder.lessThanOrEqualTo(root.get("totalAmount"), maxAmount);
            if (maxAmount == null) return criteriaBuilder.greaterThanOrEqualTo(root.get("totalAmount"), minAmount);
            return criteriaBuilder.between(root.get("totalAmount"), minAmount, maxAmount);
        };
    }

    public static Specification<Order> hasOrderNumber(String orderNumber) {
        return (root, query, criteriaBuilder) -> 
            orderNumber == null || orderNumber.trim().isEmpty() ? null : 
            criteriaBuilder.like(criteriaBuilder.upper(root.get("orderNumber")), "%" + orderNumber.toUpperCase() + "%");
    }

    public static Specification<Order> hasDeliveryAddress(String address) {
        return (root, query, criteriaBuilder) -> 
            address == null || address.trim().isEmpty() ? null : 
            criteriaBuilder.like(criteriaBuilder.lower(root.get("deliveryAddress")), "%" + address.toLowerCase() + "%");
    }

    public static Specification<Order> hasNotesContaining(String notes) {
        return (root, query, criteriaBuilder) -> 
            notes == null || notes.trim().isEmpty() ? null : 
            criteriaBuilder.like(criteriaBuilder.lower(root.get("notes")), "%" + notes.toLowerCase() + "%");
    }

    public static Specification<Order> updatedAfter(LocalDateTime date) {
        return (root, query, criteriaBuilder) -> 
            date == null ? null : criteriaBuilder.greaterThanOrEqualTo(root.get("updatedAt"), date);
    }

    public static Specification<Order> isDeliveryType() {
        return (root, query, criteriaBuilder) -> 
            criteriaBuilder.equal(root.get("type"), Order.OrderType.DELIVERY);
    }

    public static Specification<Order> isPickupType() {
        return (root, query, criteriaBuilder) -> 
            criteriaBuilder.equal(root.get("type"), Order.OrderType.PICKUP);
    }

    public static Specification<Order> isPendingOrConfirmed() {
        return (root, query, criteriaBuilder) -> 
            root.get("status").in(Order.OrderStatus.PENDING, Order.OrderStatus.CONFIRMED);
    }

    public static Specification<Order> isCompleted() {
        return (root, query, criteriaBuilder) -> 
            root.get("status").in(Order.OrderStatus.DELIVERED);
    }

    public static Specification<Order> isCancelled() {
        return (root, query, criteriaBuilder) -> 
            criteriaBuilder.equal(root.get("status"), Order.OrderStatus.CANCELLED);
    }

    public static Specification<Order> buildDynamicQuery(Order.OrderStatus status, Order.OrderType type,
                                                        Long customerId, String customerEmail,
                                                        LocalDateTime createdAfter, LocalDateTime createdBefore,
                                                        BigDecimal minAmount, BigDecimal maxAmount,
                                                        String orderNumber, String deliveryAddress) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            if (type != null) {
                predicates.add(criteriaBuilder.equal(root.get("type"), type));
            }

            if (customerId != null) {
                predicates.add(criteriaBuilder.equal(root.get("customer").get("id"), customerId));
            }

            if (customerEmail != null && !customerEmail.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("customer").get("email")), 
                    "%" + customerEmail.toLowerCase() + "%"
                ));
            }

            if (createdAfter != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), createdAfter));
            }

            if (createdBefore != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), createdBefore));
            }

            if (minAmount != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("totalAmount"), minAmount));
            }

            if (maxAmount != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("totalAmount"), maxAmount));
            }

            if (orderNumber != null && !orderNumber.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.upper(root.get("orderNumber")), 
                    "%" + orderNumber.toUpperCase() + "%"
                ));
            }

            if (deliveryAddress != null && !deliveryAddress.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("deliveryAddress")), 
                    "%" + deliveryAddress.toLowerCase() + "%"
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}