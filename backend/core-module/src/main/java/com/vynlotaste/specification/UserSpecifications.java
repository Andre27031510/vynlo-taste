package com.vynlotaste.specification;

import com.vynlotaste.entity.User;
import com.vynlotaste.entity.UserRole;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class UserSpecifications {

    public static Specification<User> hasRole(UserRole role) {
        return (root, query, criteriaBuilder) -> 
            role == null ? null : criteriaBuilder.equal(root.get("role"), role);
    }

    public static Specification<User> isActive(Boolean active) {
        return (root, query, criteriaBuilder) -> 
            active == null ? null : criteriaBuilder.equal(root.get("active"), active);
    }

    public static Specification<User> isEmailVerified(Boolean emailVerified) {
        return (root, query, criteriaBuilder) -> 
            emailVerified == null ? null : criteriaBuilder.equal(root.get("emailVerified"), emailVerified);
    }

    public static Specification<User> createdAfter(LocalDateTime date) {
        return (root, query, criteriaBuilder) -> 
            date == null ? null : criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), date);
    }

    public static Specification<User> createdBefore(LocalDateTime date) {
        return (root, query, criteriaBuilder) -> 
            date == null ? null : criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), date);
    }

    public static Specification<User> createdBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return (root, query, criteriaBuilder) -> {
            if (startDate == null && endDate == null) return null;
            if (startDate == null) return criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), endDate);
            if (endDate == null) return criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), startDate);
            return criteriaBuilder.between(root.get("createdAt"), startDate, endDate);
        };
    }

    public static Specification<User> hasEmailContaining(String email) {
        return (root, query, criteriaBuilder) -> 
            email == null || email.trim().isEmpty() ? null : 
            criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), "%" + email.toLowerCase() + "%");
    }

    public static Specification<User> hasNameContaining(String name) {
        return (root, query, criteriaBuilder) -> {
            if (name == null || name.trim().isEmpty()) return null;
            String searchTerm = "%" + name.toLowerCase() + "%";
            return criteriaBuilder.or(
                criteriaBuilder.like(criteriaBuilder.lower(root.get("firstName")), searchTerm),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("lastName")), searchTerm)
            );
        };
    }

    public static Specification<User> lastLoginAfter(LocalDateTime date) {
        return (root, query, criteriaBuilder) -> 
            date == null ? null : criteriaBuilder.greaterThanOrEqualTo(root.get("lastLoginAt"), date);
    }

    public static Specification<User> hasPhone(String phone) {
        return (root, query, criteriaBuilder) -> 
            phone == null || phone.trim().isEmpty() ? null : 
            criteriaBuilder.like(root.get("phone"), "%" + phone + "%");
    }

    public static Specification<User> buildDynamicQuery(UserRole role, Boolean active, Boolean emailVerified,
                                                       LocalDateTime createdAfter, LocalDateTime createdBefore,
                                                       String emailContains, String nameContains, String phone) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (role != null) {
                predicates.add(criteriaBuilder.equal(root.get("role"), role));
            }

            if (active != null) {
                predicates.add(criteriaBuilder.equal(root.get("active"), active));
            }

            if (emailVerified != null) {
                predicates.add(criteriaBuilder.equal(root.get("emailVerified"), emailVerified));
            }

            if (createdAfter != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), createdAfter));
            }

            if (createdBefore != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), createdBefore));
            }

            if (emailContains != null && !emailContains.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("email")), 
                    "%" + emailContains.toLowerCase() + "%"
                ));
            }

            if (nameContains != null && !nameContains.trim().isEmpty()) {
                String searchTerm = "%" + nameContains.toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("firstName")), searchTerm),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("lastName")), searchTerm)
                ));
            }

            if (phone != null && !phone.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("phone"), "%" + phone + "%"));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}