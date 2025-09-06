package com.vynlotaste.dto.auth;

import com.vynlotaste.dto.user.UserResponseDto;
import lombok.Data;

@Data
public class AuthResponseDto {
    private String token;
    private String refreshToken;
    private UserResponseDto user;
    private Long expiresIn;
}