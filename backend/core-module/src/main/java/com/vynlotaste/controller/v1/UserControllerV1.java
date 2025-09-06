package com.vynlotaste.controller.v1;

import com.vynlotaste.dto.common.PagedResponseDto;
import com.vynlotaste.dto.user.UserRequestDto;
import com.vynlotaste.dto.user.UserResponseDto;
import com.vynlotaste.dto.validation.ValidationGroups;
import com.vynlotaste.entity.User;
import com.vynlotaste.mapper.UserMapper;
import com.vynlotaste.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Usuários V1", description = "Operações de gerenciamento de usuários - Versão 1.0")
@SecurityRequirement(name = "bearerAuth")
public class UserControllerV1 {

    private final UserService userService;
    private final UserMapper userMapper;

    @Operation(
        summary = "Criar novo usuário",
        description = "Cria um novo usuário no sistema com validação completa de dados",
        tags = {"Usuários V1"}
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Usuário criado com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = UserResponseDto.class),
                examples = @ExampleObject(
                    name = "Usuário criado",
                    value = """
                        {
                          "id": 1,
                          "email": "usuario@exemplo.com",
                          "username": "usuario123",
                          "firstName": "João",
                          "lastName": "Silva",
                          "role": "CUSTOMER",
                          "active": true,
                          "createdAt": "2024-01-01T10:00:00Z"
                        }
                        """
                )
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Dados inválidos fornecidos",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Erro de validação",
                    value = """
                        {
                          "timestamp": "2024-01-01T10:00:00Z",
                          "status": 400,
                          "error": "Bad Request",
                          "message": "Email já está em uso",
                          "code": "VT-1002",
                          "path": "/api/v1/users"
                        }
                        """
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Token de autenticação inválido"),
        @ApiResponse(responseCode = "403", description = "Permissões insuficientes")
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<UserResponseDto> createUser(
        @Parameter(
            description = "Dados do usuário a ser criado",
            required = true,
            content = @Content(
                examples = @ExampleObject(
                    name = "Novo usuário",
                    value = """
                        {
                          "email": "novo@exemplo.com",
                          "username": "novousuario",
                          "firstName": "Maria",
                          "lastName": "Santos",
                          "phone": "(11) 99999-9999",
                          "address": "Rua Exemplo, 123",
                          "cpf": "123.456.789-00",
                          "role": "CUSTOMER"
                        }
                        """
                )
            )
        )
        @Validated(ValidationGroups.Create.class) @Valid @RequestBody UserRequestDto userRequest
    ) {
        log.info("Creating new user with email: {}", userRequest.getEmail());
        User user = userService.createUser(userRequest);
        UserResponseDto response = userMapper.toResponseDto(user);
        log.info("User created successfully with ID: {}", response.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
        summary = "Listar usuários",
        description = "Retorna lista paginada de usuários com filtros opcionais",
        tags = {"Usuários V1"}
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Lista de usuários retornada com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = PagedResponseDto.class),
                examples = @ExampleObject(
                    name = "Lista paginada",
                    value = """
                        {
                          "content": [
                            {
                              "id": 1,
                              "email": "usuario1@exemplo.com",
                              "username": "usuario1",
                              "firstName": "João",
                              "lastName": "Silva",
                              "role": "CUSTOMER",
                              "active": true
                            }
                          ],
                          "page": 0,
                          "size": 20,
                          "totalElements": 1,
                          "totalPages": 1,
                          "first": true,
                          "last": true
                        }
                        """
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Token de autenticação inválido"),
        @ApiResponse(responseCode = "403", description = "Permissões insuficientes")
    })
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<PagedResponseDto<UserResponseDto>> getAllUsers(
        @Parameter(
            description = "Parâmetros de paginação",
            example = "page=0&size=20&sort=createdAt,desc"
        )
        @PageableDefault(size = 20, sort = "createdAt") Pageable pageable
    ) {
        log.debug("Fetching users with pagination: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<User> userPage = userService.findAll(pageable);
        List<UserResponseDto> userDtos = userPage.getContent().stream()
            .map(userMapper::toResponseDto)
            .toList();
        
        PagedResponseDto<UserResponseDto> response = PagedResponseDto.<UserResponseDto>builder()
            .content(userDtos)
            .page(userPage.getNumber())
            .size(userPage.getSize())
            .totalElements(userPage.getTotalElements())
            .totalPages(userPage.getTotalPages())
            .first(userPage.isFirst())
            .last(userPage.isLast())
            .build();
        
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Buscar usuário por ID",
        description = "Retorna os dados de um usuário específico pelo seu ID",
        tags = {"Usuários V1"}
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Usuário encontrado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = UserResponseDto.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Usuário não encontrado",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Usuário não encontrado",
                    value = """
                        {
                          "timestamp": "2024-01-01T10:00:00Z",
                          "status": 404,
                          "error": "Not Found",
                          "message": "Usuário não encontrado com ID: 999",
                          "code": "VT-1001",
                          "path": "/api/v1/users/999"
                        }
                        """
                )
            )
        )
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or @userService.isOwner(#id, authentication.name)")
    public ResponseEntity<UserResponseDto> getUserById(
        @Parameter(description = "ID do usuário", example = "1", required = true)
        @PathVariable Long id
    ) {
        log.debug("Fetching user by ID: {}", id);
        User user = userService.findById(id);
        UserResponseDto response = userMapper.toResponseDto(user);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Atualizar usuário",
        description = "Atualiza os dados de um usuário existente",
        tags = {"Usuários V1"}
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Usuário atualizado com sucesso",
            content = @Content(schema = @Schema(implementation = UserResponseDto.class))
        ),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
        @ApiResponse(responseCode = "403", description = "Permissões insuficientes")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or @userService.isOwner(#id, authentication.name)")
    public ResponseEntity<UserResponseDto> updateUser(
        @Parameter(description = "ID do usuário", required = true)
        @PathVariable Long id,
        @Parameter(
            description = "Dados atualizados do usuário",
            required = true,
            content = @Content(
                examples = @ExampleObject(
                    name = "Atualização de usuário",
                    value = """
                        {
                          "firstName": "João Carlos",
                          "lastName": "Silva Santos",
                          "phone": "(11) 98888-7777",
                          "address": "Rua Nova, 456"
                        }
                        """
                )
            )
        )
        @Validated(ValidationGroups.Update.class) @Valid @RequestBody UserRequestDto userRequest
    ) {
        log.info("Updating user with ID: {}", id);
        User user = userService.updateUser(id, userRequest);
        UserResponseDto response = userMapper.toResponseDto(user);
        log.info("User updated successfully: {}", id);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Excluir usuário",
        description = "Remove um usuário do sistema (soft delete)",
        tags = {"Usuários V1"}
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Usuário excluído com sucesso"),
        @ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
        @ApiResponse(responseCode = "403", description = "Permissões insuficientes")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(
        @Parameter(description = "ID do usuário", required = true)
        @PathVariable Long id
    ) {
        log.info("Deleting user with ID: {}", id);
        userService.deleteUser(id);
        log.info("User deleted successfully: {}", id);
        return ResponseEntity.noContent().build();
    }

    @Operation(
        summary = "Ativar usuário",
        description = "Ativa um usuário previamente desativado",
        tags = {"Usuários V1"}
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Usuário ativado com sucesso",
            content = @Content(schema = @Schema(implementation = UserResponseDto.class))
        ),
        @ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
        @ApiResponse(responseCode = "403", description = "Permissões insuficientes")
    })
    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<UserResponseDto> activateUser(
        @Parameter(description = "ID do usuário", required = true)
        @PathVariable Long id
    ) {
        log.info("Activating user with ID: {}", id);
        User user = userService.activateUser(id);
        UserResponseDto response = userMapper.toResponseDto(user);
        log.info("User activated successfully: {}", id);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Desativar usuário",
        description = "Desativa um usuário (soft delete)",
        tags = {"Usuários V1"}
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Usuário desativado com sucesso",
            content = @Content(schema = @Schema(implementation = UserResponseDto.class))
        ),
        @ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
        @ApiResponse(responseCode = "403", description = "Permissões insuficientes")
    })
    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<UserResponseDto> deactivateUser(
        @Parameter(description = "ID do usuário", required = true)
        @PathVariable Long id
    ) {
        log.info("Deactivating user with ID: {}", id);
        User user = userService.deactivateUser(id);
        UserResponseDto response = userMapper.toResponseDto(user);
        log.info("User deactivated successfully: {}", id);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Buscar usuários",
        description = "Busca usuários por nome, email ou username",
        tags = {"Usuários V1"}
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Usuários encontrados",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = PagedResponseDto.class)
            )
        )
    })
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<PagedResponseDto<UserResponseDto>> searchUsers(
        @Parameter(description = "Termo de busca", example = "joão", required = true)
        @RequestParam String query,
        @Parameter(description = "Parâmetros de paginação")
        @PageableDefault(size = 20) Pageable pageable
    ) {
        log.debug("Searching users with query: {}", query);
        Page<User> userPage = userService.searchUsers(query, pageable);
        List<UserResponseDto> userDtos = userPage.getContent().stream()
            .map(userMapper::toResponseDto)
            .toList();
        
        PagedResponseDto<UserResponseDto> response = PagedResponseDto.<UserResponseDto>builder()
            .content(userDtos)
            .page(userPage.getNumber())
            .size(userPage.getSize())
            .totalElements(userPage.getTotalElements())
            .totalPages(userPage.getTotalPages())
            .first(userPage.isFirst())
            .last(userPage.isLast())
            .build();
        
        return ResponseEntity.ok(response);
    }
}