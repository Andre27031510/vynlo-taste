package com.vynlotaste.controller;

import com.vynlotaste.dto.auth.AuthResponseDto;
import com.vynlotaste.dto.auth.LoginRequestDto;
import com.vynlotaste.dto.user.UserRequestDto;
import com.vynlotaste.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        AuthResponseDto response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody UserRequestDto userRequest) {
        AuthResponseDto response = authService.register(userRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String token) {
        authService.logout(token);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDto> refreshToken(@RequestHeader("Authorization") String refreshToken) {
        AuthResponseDto response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }
}