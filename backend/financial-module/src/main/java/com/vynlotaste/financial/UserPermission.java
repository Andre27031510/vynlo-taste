package com.vynlotaste.financial;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_permissions")
@Data
public class UserPermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String permission;
    private String description;
}