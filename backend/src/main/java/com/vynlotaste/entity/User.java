package com.vynlotaste.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_email", columnList = "email", unique = true),
    @Index(name = "idx_user_username", columnList = "username", unique = true),
    @Index(name = "idx_user_cpf", columnList = "cpf"),
    @Index(name = "idx_user_active", columnList = "active")
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ter formato válido")
    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @NotBlank(message = "Username é obrigatório")
    @Size(min = 3, max = 30, message = "Username deve ter entre 3 e 30 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username deve conter apenas letras, números e underscore")
    @Column(unique = true, nullable = false, length = 30)
    private String username;

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 50, message = "Nome deve ter entre 2 e 50 caracteres")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s]+$", message = "Nome deve conter apenas letras")
    @Column(nullable = false, length = 50)
    private String firstName;

    @NotBlank(message = "Sobrenome é obrigatório")
    @Size(min = 2, max = 50, message = "Sobrenome deve ter entre 2 e 50 caracteres")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s]+$", message = "Sobrenome deve conter apenas letras")
    @Column(nullable = false, length = 50)
    private String lastName;

    @Pattern(regexp = "^\\(?[1-9]{2}\\)?[0-9]{4,5}-?[0-9]{4}$", message = "Telefone deve ter formato válido")
    @Column(length = 20)
    private String phone;

    @Size(max = 200, message = "Endereço deve ter no máximo 200 caracteres")
    @Column(length = 200)
    private String address;

    @Pattern(regexp = "^[0-9]{3}\\.?[0-9]{3}\\.?[0-9]{3}-?[0-9]{2}$", message = "CPF deve ter formato válido")
    @Column(length = 14)
    private String cpf;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role = UserRole.CUSTOMER;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false)
    private boolean emailVerified = false;

    @Column(length = 500)
    private String profileImage;

    @Column(length = 1000)
    private String preferences;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column
    private LocalDateTime lastLoginAt;

    @Column
    private LocalDateTime lastActivityAt;

    public enum UserRole {
        ADMIN, MANAGER, STAFF, CUSTOMER, DRIVER
    }

    // Métodos de negócio
    public String getFullName() {
        return firstName + " " + lastName;
    }

    public boolean isAdmin() {
        return role == UserRole.ADMIN;
    }

    public boolean isManager() {
        return role == UserRole.MANAGER;
    }

    public boolean canManageUsers() {
        return role == UserRole.ADMIN || role == UserRole.MANAGER;
    }

    public void updateLastLogin() {
        this.lastLoginAt = LocalDateTime.now();
        this.lastActivityAt = LocalDateTime.now();
    }

    public void updateLastActivity() {
        this.lastActivityAt = LocalDateTime.now();
    }
}