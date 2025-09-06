package com.vynlotaste.exception.user;

import com.vynlotaste.exception.BaseException;
import com.vynlotaste.exception.ErrorCode;

public class UserNotFoundException extends BaseException {
    
    public UserNotFoundException(Long userId) {
        super(ErrorCode.USER_NOT_FOUND, "User not found with ID: " + userId, userId);
    }
    
    public UserNotFoundException(String email) {
        super(ErrorCode.USER_NOT_FOUND, "User not found with email: " + email, email);
    }
}