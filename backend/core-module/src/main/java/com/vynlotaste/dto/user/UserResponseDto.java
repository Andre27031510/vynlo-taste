package com.vynlotaste.dto.user;

import com.vynlotaste.entity.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;
// Lombok removido - usando getters/setters manuais
import java.time.LocalDateTime;

// Getters/setters manuais
@Schema(description = "Dados de resposta do usuário")
public class UserResponseDto {
    
    @Schema(description = "ID único do usuário", example = "1")
    private Long id;
    
    @Schema(description = "Email do usuário", example = "usuario@exemplo.com")
    private String email;
    
    @Schema(description = "Nome de usuário", example = "usuario123")
    private String username;
    
    @Schema(description = "Primeiro nome", example = "João")
    private String firstName;
    
    @Schema(description = "Sobrenome", example = "Silva")
    private String lastName;
    
    @Schema(description = "Nome completo", example = "João Silva")
    private String fullName;
    
    @Schema(description = "Telefone", example = "(11) 99999-9999")
    private String phone;
    
    @Schema(description = "Endereço", example = "Rua Exemplo, 123")
    private String address;
    
    @Schema(description = "Papel do usuário", example = "CUSTOMER")
    private UserRole role;
    
    @Schema(description = "Status ativo", example = "true")
    private Boolean active;
    
    @Schema(description = "Email verificado", example = "true")
    private Boolean emailVerified;
    
    @Schema(description = "Data de criação", example = "2024-01-01T10:00:00Z")
    private LocalDateTime createdAt;
    
    @Schema(description = "Data de atualização", example = "2024-01-01T10:00:00Z")
    private LocalDateTime updatedAt;
    
    @Schema(description = "Último login", example = "2024-01-01T10:00:00Z")
    private LocalDateTime lastLoginAt;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public Boolean getEmailVerified() { return emailVerified; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }
}