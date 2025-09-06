package com.vynlotaste.mapper;

import com.vynlotaste.dto.user.UserRequestDto;
import com.vynlotaste.dto.user.UserResponseDto;
import com.vynlotaste.entity.User;
import org.mapstruct.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
    unmappedTargetPolicy = ReportingPolicy.WARN,
    uses = {DateTimeMapper.class}
)
@Component
public interface UserMapper {
    
    // Conversão para Response DTO
    @Mapping(target = "fullName", expression = "java(user.getFullName())")
    @Mapping(target = "id", source = "id")
    @Mapping(target = "active", source = "active")
    @Mapping(target = "emailVerified", source = "emailVerified")
    UserResponseDto toResponseDto(User user);
    
    // Conversão para lista de Response DTOs
    List<UserResponseDto> toResponseDtoList(List<User> users);
    
    // Conversão para Entity (Create)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "lastLoginAt", ignore = true)
    @Mapping(target = "lastActivityAt", ignore = true)
    @Mapping(target = "emailVerified", constant = "false")
    @Mapping(target = "active", defaultValue = "true")
    @Mapping(target = "role", defaultValue = "CUSTOMER")
    User toEntity(UserRequestDto dto);
    
    // Conversão para Entity com contexto de criação
    @Named("createUser")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "lastLoginAt", ignore = true)
    @Mapping(target = "lastActivityAt", ignore = true)
    @Mapping(target = "emailVerified", constant = "false")
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "role", source = "role", defaultValue = "CUSTOMER")
    User toEntityForCreate(UserRequestDto dto);
    
    // Atualização de Entity existente (Update)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true) // Email não pode ser alterado
    @Mapping(target = "username", ignore = true) // Username não pode ser alterado
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "lastLoginAt", ignore = true)
    @Mapping(target = "lastActivityAt", ignore = true)
    @Mapping(target = "emailVerified", ignore = true)
    @Mapping(target = "role", ignore = true) // Role só pode ser alterado por admin
    void updateEntityFromDto(UserRequestDto dto, @MappingTarget User user);
    
    // Atualização com contexto de admin
    @Named("adminUpdate")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "lastLoginAt", ignore = true)
    @Mapping(target = "lastActivityAt", ignore = true)
    @Mapping(target = "emailVerified", ignore = true)
    void updateEntityFromDtoAsAdmin(UserRequestDto dto, @MappingTarget User user);
    
    // Conversão parcial para perfil público
    @Named("publicProfile")
    @Mapping(target = "id", source = "id")
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "phone", ignore = true)
    @Mapping(target = "address", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "emailVerified", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "lastLoginAt", ignore = true)
    @Mapping(target = "fullName", expression = "java(user.getFullName())")
    UserResponseDto toPublicProfileDto(User user);
    
    // Mapeamento customizado para campos específicos
    @AfterMapping
    default void enrichResponseDto(@MappingTarget UserResponseDto dto, User user) {
        if (user != null) {
            // Adicionar lógica customizada se necessário
            if (dto.getFullName() == null) {
                dto.setFullName(user.getFirstName() + " " + user.getLastName());
            }
        }
    }
    
    // Validação antes do mapeamento
    @BeforeMapping
    default void validateUser(User user) {
        if (user != null && user.getFirstName() != null && user.getLastName() != null) {
            // Validações customizadas se necessário
        }
    }
    
    // Mapeamento condicional
    @Condition
    default boolean isNotEmpty(String value) {
        return value != null && !value.trim().isEmpty();
    }
}