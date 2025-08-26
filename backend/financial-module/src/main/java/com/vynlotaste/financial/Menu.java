package com.vynlotaste.financial;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "menus")
@Data
public class Menu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    private Boolean active;
}