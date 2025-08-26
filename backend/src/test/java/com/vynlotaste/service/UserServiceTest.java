package com.vynlotaste.service;

import com.vynlotaste.dto.UserRegistrationDto;
import com.vynlotaste.entity.User;
import com.vynlotaste.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private UserRegistrationDto testRegistrationDto;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setUsername("testuser");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setPhone("(11) 99999-9999");
        testUser.setActive(true);
        testUser.setCreatedAt(LocalDateTime.now());

        testRegistrationDto = new UserRegistrationDto();
        testRegistrationDto.setEmail("newuser@example.com");
        testRegistrationDto.setUsername("newuser");
        testRegistrationDto.setFirstName("New");
        testRegistrationDto.setLastName("User");
        testRegistrationDto.setPhone("(11) 88888-8888");
        testRegistrationDto.setAddress("Rua Teste, 123");
        testRegistrationDto.setCpf("123.456.789-00");
    }

    @Test
    void createUserFromFirebase_Success() {
        // Arrange
        String email = "firebase@example.com";
        String name = "Firebase User";
        
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.createUserFromFirebase(email, name);

        // Assert
        assertNotNull(result);
        assertEquals(email, result.getEmail());
        assertEquals("Firebase", result.getFirstName());
        assertEquals("User", result.getLastName());
        assertEquals(User.UserRole.CUSTOMER, result.getRole());
        assertTrue(result.isActive());
        
        verify(userRepository).save(any(User.class));
    }

    @Test
    void createUserFromFirebase_WithNullName() {
        // Arrange
        String email = "firebase@example.com";
        String name = null;
        
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.createUserFromFirebase(email, name);

        // Assert
        assertNotNull(result);
        assertEquals(email, result.getEmail());
        assertEquals("", result.getFirstName());
        assertEquals("", result.getLastName());
        
        verify(userRepository).save(any(User.class));
    }

    @Test
    void createUserFromRegistration_Success() {
        // Arrange
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.createUserFromRegistration(testRegistrationDto);

        // Assert
        assertNotNull(result);
        assertEquals(testRegistrationDto.getEmail(), result.getEmail());
        assertEquals(testRegistrationDto.getUsername(), result.getUsername());
        assertEquals(testRegistrationDto.getFirstName(), result.getFirstName());
        assertEquals(testRegistrationDto.getLastName(), result.getLastName());
        assertEquals(testRegistrationDto.getPhone(), result.getPhone());
        assertEquals(testRegistrationDto.getAddress(), result.getAddress());
        assertEquals(testRegistrationDto.getCpf(), result.getCpf());
        assertEquals(User.UserRole.CUSTOMER, result.getRole());
        assertTrue(result.isActive());
        
        verify(userRepository).save(any(User.class));
    }

    @Test
    void isEmailAvailable_WhenEmailNotExists_ReturnsTrue() {
        // Arrange
        String email = "available@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act
        boolean result = userService.isEmailAvailable(email);

        // Assert
        assertTrue(result);
        verify(userRepository).findByEmail(email);
    }

    @Test
    void isEmailAvailable_WhenEmailExists_ReturnsFalse() {
        // Arrange
        String email = "existing@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));

        // Act
        boolean result = userService.isEmailAvailable(email);

        // Assert
        assertFalse(result);
        verify(userRepository).findByEmail(email);
    }

    @Test
    void isUsernameAvailable_WhenUsernameNotExists_ReturnsTrue() {
        // Arrange
        String username = "availableuser";
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Act
        boolean result = userService.isUsernameAvailable(username);

        // Assert
        assertTrue(result);
        verify(userRepository).findByUsername(username);
    }

    @Test
    void isUsernameAvailable_WhenUsernameExists_ReturnsFalse() {
        // Arrange
        String username = "existinguser";
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));

        // Act
        boolean result = userService.isUsernameAvailable(username);

        // Assert
        assertFalse(result);
        verify(userRepository).findByUsername(username);
    }
}
