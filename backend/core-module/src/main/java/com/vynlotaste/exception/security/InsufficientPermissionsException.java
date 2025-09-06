package com.vynlotaste.exception.security;

import com.vynlotaste.exception.BaseException;
import com.vynlotaste.exception.ErrorCode;

public class InsufficientPermissionsException extends BaseException {
    
    public InsufficientPermissionsException(String userId, String resource) {
        super(ErrorCode.INSUFFICIENT_PERMISSIONS, 
            String.format("User %s lacks permission to access %s", userId, resource), 
            userId, resource);
    }
    
    public InsufficientPermissionsException(String userId, String action, String resource) {
        super(ErrorCode.INSUFFICIENT_PERMISSIONS, 
            String.format("User %s cannot %s on %s", userId, action, resource), 
            userId, action, resource);
    }
    
    public InsufficientPermissionsException(String requiredRole, String userRole, boolean isRoleCheck) {
        super(ErrorCode.INSUFFICIENT_PERMISSIONS, 
            String.format("Required role: %s, User role: %s", requiredRole, userRole), 
            requiredRole, userRole);
    }
}