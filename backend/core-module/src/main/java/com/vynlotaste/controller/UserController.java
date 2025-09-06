package com.vynlotaste.controller;

import com.vynlotaste.dto.common.PagedResponseDto;
import com.vynlotaste.dto.user.UserRequestDto;
import com.vynlotaste.dto.user.UserResponseDto;
import com.vynlotaste.dto.validation.ValidationGroups;
import com.vynlotaste.entity.User;
import com.vynlotaste.mapper.UserMapper;
import com.vynlotaste.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> createUser(
            @Validated(ValidationGroups.Create.class) @RequestBody UserRequestDto userRequest) {
        
        User user = userService.createUser(userRequest);
        UserResponseDto response = userMapper.toResponseDto(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<PagedResponseDto<UserResponseDto>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userService.findAll(pageable);
        
        PagedResponseDto<UserResponseDto> response = PagedResponseDto.of(
            userPage.getContent().stream()
                .map(userMapper::toResponseDto)
                .toList(),
            page, size, userPage.getTotalElements()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #id == authentication.principal.id")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id) {
        User user = userService.findById(id);
        UserResponseDto response = userMapper.toResponseDto(user);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable Long id,
            @Validated(ValidationGroups.Update.class) @RequestBody UserRequestDto userRequest) {
        
        User user = userService.updateUser(id, userRequest);
        UserResponseDto response = userMapper.toResponseDto(user);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<UserResponseDto> activateUser(@PathVariable Long id) {
        User user = userService.activateUser(id);
        UserResponseDto response = userMapper.toResponseDto(user);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<UserResponseDto> deactivateUser(@PathVariable Long id) {
        User user = userService.deactivateUser(id);
        UserResponseDto response = userMapper.toResponseDto(user);
        return ResponseEntity.ok(response);
    }
}