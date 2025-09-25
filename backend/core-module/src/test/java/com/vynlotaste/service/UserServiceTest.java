package com.vynlotaste.service;

import com.vynlotaste.entity.User;
import com.vynlotaste.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cache.CacheManager;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService - Testes Unitários Robustos")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CacheManager cacheManager;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private User firebaseUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .firstName("João")
                .lastName("Silva")
                .email("joao@vynlotaste.com")
                .username("joao.silva")
                .phone("+5511999999999")
                .status(User.UserStatus.ACTIVE)
                .role(User.UserRole.CUSTOMER)
                .firebaseUid("firebase123")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        firebaseUser = User.builder()
                .id(2L)
                .firstName("Maria")
                .lastName("Santos")
                .email("maria@vynlotaste.com")
                .username("maria.santos")
                .phone("+5511888888888")
                .status(User.UserStatus.ACTIVE)
                .role(User.UserRole.CUSTOMER)
                .firebaseUid("firebase456")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Deve criar usuário com sucesso")
    void shouldCreateUserSuccessfully() {
        // Given
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        User result = userService.createUser(
                "João", "Silva", "joao@vynlotaste.com", 
                "joao.silva", "+5511999999999"
        );

        // Then
        assertNotNull(result);
        assertEquals("João", result.getFirstName());
        assertEquals("Silva", result.getLastName());
        assertEquals("joao@vynlotaste.com", result.getEmail());
        assertEquals(User.UserStatus.ACTIVE, result.getStatus());
        assertEquals(User.UserRole.CUSTOMER, result.getRole());
        
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Deve encontrar usuário por email")
    void shouldFindUserByEmail() {
        // Given
        when(userRepository.findByEmail("joao@vynlotaste.com")).thenReturn(Optional.of(testUser));

        // When
        Optional<User> result = userService.findByEmail("joao@vynlotaste.com");

        // Then
        assertTrue(result.isPresent());
        assertEquals("joao@vynlotaste.com", result.get().getEmail());
        verify(userRepository).findByEmail("joao@vynlotaste.com");
    }

    @Test
    @DisplayName("Deve encontrar usuário por Firebase UID")
    void shouldFindUserByFirebaseUid() {
        // Given
        when(userRepository.findByFirebaseUid("firebase123")).thenReturn(Optional.of(testUser));

        // When
        Optional<User> result = userService.findByFirebaseUid("firebase123");

        // Then
        assertTrue(result.isPresent());
        assertEquals("firebase123", result.get().getFirebaseUid());
        verify(userRepository).findByFirebaseUid("firebase123");
    }

    @Test
    @DisplayName("Deve criar usuário a partir do Firebase")
    void shouldCreateUserFromFirebase() {
        // Given
        when(userRepository.save(any(User.class))).thenReturn(firebaseUser);

        // When
        User result = userService.createUserFromFirebase("maria@vynlotaste.com", "Maria Santos");

        // Then
        assertNotNull(result);
        assertEquals("maria@vynlotaste.com", result.getEmail());
        assertEquals("Maria Santos", result.getDisplayName());
        assertEquals(User.UserStatus.ACTIVE, result.getStatus());
        assertEquals(User.UserRole.CUSTOMER, result.getRole());
        
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Deve salvar usuário com sucesso")
    void shouldSaveUserSuccessfully() {
        // Given
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        User result = userService.save(testUser);

        // Then
        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());
        verify(userRepository).save(testUser);
    }

    @Test
    @DisplayName("Deve retornar vazio quando usuário não encontrado por email")
    void shouldReturnEmptyWhenUserNotFoundByEmail() {
        // Given
        when(userRepository.findByEmail("inexistente@vynlotaste.com")).thenReturn(Optional.empty());

        // When
        Optional<User> result = userService.findByEmail("inexistente@vynlotaste.com");

        // Then
        assertFalse(result.isPresent());
        verify(userRepository).findByEmail("inexistente@vynlotaste.com");
    }

    @Test
    @DisplayName("Deve retornar vazio quando usuário não encontrado por Firebase UID")
    void shouldReturnEmptyWhenUserNotFoundByFirebaseUid() {
        // Given
        when(userRepository.findByFirebaseUid("inexistente")).thenReturn(Optional.empty());

        // When
        Optional<User> result = userService.findByFirebaseUid("inexistente");

        // Then
        assertFalse(result.isPresent());
        verify(userRepository).findByFirebaseUid("inexistente");
    }

    @Test
    @DisplayName("Deve lançar exceção quando email é nulo")
    void shouldThrowExceptionWhenEmailIsNull() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser("João", "Silva", null, "joao.silva", "+5511999999999");
        });
    }

    @Test
    @DisplayName("Deve lançar exceção quando email é inválido")
    void shouldThrowExceptionWhenEmailIsInvalid() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser("João", "Silva", "email-invalido", "joao.silva", "+5511999999999");
        });
    }

    @Test
    @DisplayName("Deve validar dados obrigatórios na criação de usuário")
    void shouldValidateRequiredFieldsWhenCreatingUser() {
        // Test cases for required field validation
        assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser(null, "Silva", "joao@vynlotaste.com", "joao.silva", "+5511999999999");
        });

        assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser("João", null, "joao@vynlotaste.com", "joao.silva", "+5511999999999");
        });

        assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser("João", "Silva", "joao@vynlotaste.com", null, "+5511999999999");
        });
    }
}
