package com.vynlotaste.entity;

import org.springframework.security.core.GrantedAuthority;

public enum UserRole implements GrantedAuthority {
    ADMIN("ROLE_ADMIN"),
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