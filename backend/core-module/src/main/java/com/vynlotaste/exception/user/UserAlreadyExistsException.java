package com.vynlotaste.exception.user;

import com.vynlotaste.exception.BaseException;
import com.vynlotaste.exception.ErrorCode;

public class UserAlreadyExistsException extends BaseException {
    
    public UserAlreadyExistsException(String email) {
        super(ErrorCode.USER_ALREADY_EXISTS, "User already exists with email: " + email, email);
    }
    
    public UserAlreadyExistsException(String field, String value) {
        super(ErrorCode.USER_ALREADY_EXISTS, 
            String.format("User already exists with %s: %s", field, value), 
            field, value);
    }
}