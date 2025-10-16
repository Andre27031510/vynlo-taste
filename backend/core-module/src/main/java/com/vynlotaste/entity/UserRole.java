package com.vynlotaste.entity;

import org.springframework.security.core.GrantedAuthority;

/**
 * User Roles - Hierarquia de permissões do sistema Vynlo
 * SUPER_ADMIN: Acesso total à plataforma (Vynlo Tech)
 * ADMIN: Gerencia empresa/cliente específico
 * MANAGER: Gerente com permissões limitadas
 * STAFF/EMPLOYEE: Equipe operacional
 * CUSTOMER: Cliente final
 * DRIVER: Motoboy/Entregador
 */
public enum UserRole implements GrantedAuthority {
    SUPER_ADMIN("ROLE_SUPER_ADMIN"),  // Vynlo Tech - Acesso total
    ADMIN("ROLE_ADMIN"),               // Admin do cliente
    MANAGER("ROLE_MANAGER"),
    STAFF("ROLE_STAFF"),
    EMPLOYEE("ROLE_EMPLOYEE"),
    CUSTOMER("ROLE_CUSTOMER"),
    DRIVER("ROLE_DRIVER");
    
    private final String authority;
    
    UserRole(String authority) {
        this.authority = authority;
    }
    
    @Override
    public String getAuthority() {
        return authority;
    }
    
    @Override
    public String toString() {
        return authority;
    }
}