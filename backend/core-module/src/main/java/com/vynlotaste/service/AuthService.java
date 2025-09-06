package com.vynlotaste.service;

import com.vynlotaste.dto.auth.AuthResponseDto;
import com.vynlotaste.dto.auth.LoginRequestDto;
import com.vynlotaste.dto.user.UserRequestDto;

import com.vynlotaste.entity.User;
import com.vynlotaste.mapper.UserMapper;
import com.vynlotaste.repository.UserRepository;
import com.vynlotaste.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public AuthResponseDto login(LoginRequestDto loginRequest) {
        // Implementação básica - em produção usar Spring Security
        User user = userRepository.findByEmail(loginRequest.getEmail())
            .orElseThrow(() -> new UnauthorizedException("Credenciais inválidas"));

        AuthResponseDto response = new AuthResponseDto();
        response.setToken("jwt-token-placeholder");
        response.setRefreshToken("refresh-token-placeholder");
        response.setUser(userMapper.toResponseDto(user));
        response.setExpiresIn(3600L);
        
        return response;
    }

    public AuthResponseDto register(UserRequestDto userRequest) {
        User user = userMapper.toEntity(userRequest);
        user = userRepository.save(user);
        
        AuthResponseDto response = new AuthResponseDto();
        response.setToken("jwt-token-placeholder");
        response.setRefreshToken("refresh-token-placeholder");
        response.setUser(userMapper.toResponseDto(user));
        response.setExpiresIn(3600L);
        
        return response;
    }

    public void logout(String token) {
        // Implementar invalidação do token
    }

    public AuthResponseDto refreshToken(String refreshToken) {
        // Implementar refresh do token
        AuthResponseDto response = new AuthResponseDto();
        response.setToken("new-jwt-token-placeholder");
        response.setRefreshToken("new-refresh-token-placeholder");
        response.setExpiresIn(3600L);
        
        return response;
    }
}