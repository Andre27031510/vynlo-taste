package com.vynlotaste.projection;

import com.vynlotaste.entity.UserRole;

import java.time.LocalDateTime;

public interface UserProjection {
    
    Long getId();
    String getEmail();
    String getUsername();
    String getFirstName();
    String getLastName();
    UserRole getRole();
    Boolean getActive();
    LocalDateTime getCreatedAt();
    
    // Computed properties
    default String getFullName() {
        return getFirstName() + " " + getLastName();
    }
}

// Implementação concreta para casos específicos
class UserSummaryProjection {
    private final Long id;
    private final String email;
    private final String fullName;
    private final UserRole role;
    private final Boolean active;
    
    public UserSummaryProjection(Long id, String email, String firstName, String lastName, UserRole role, Boolean active) {
        this.id = id;
        this.email = email;
        this.fullName = firstName + " " + lastName;
        this.role = role;
        this.active = active;
    }
    
    // Getters
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public UserRole getRole() { return role; }
    public Boolean getActive() { return active; }
}