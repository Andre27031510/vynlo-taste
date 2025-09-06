package com.vynlotaste.exception.user;

import com.vynlotaste.exception.BaseException;
import com.vynlotaste.exception.ErrorCode;

public class UserInactiveException extends BaseException {
    
    public UserInactiveException(Long userId) {
        super(ErrorCode.USER_INACTIVE, "User is inactive with ID: " + userId, userId);
    }
    
    public UserInactiveException(String email) {
        super(ErrorCode.USER_INACTIVE, "User is inactive with email: " + email, email);
    }
}