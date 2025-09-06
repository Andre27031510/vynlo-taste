package com.vynlotaste.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserRegistrationDto {
    
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 50, message = "Nome deve ter entre 2 e 50 caracteres")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s]+$", message = "Nome deve conter apenas letras")
    private String firstName;
    
    @NotBlank(message = "Sobrenome é obrigatório")
    @Size(min = 2, max = 50, message = "Sobrenome deve ter entre 2 e 50 caracteres")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s]+$", message = "Sobrenome deve conter apenas letras")
    private String lastName;
    
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ter formato válido")
    @Size(max = 100, message = "Email deve ter no máximo 100 caracteres")
    private String email;
    
    @NotBlank(message = "Username é obrigatório")
    @Size(min = 3, max = 30, message = "Username deve ter entre 3 e 30 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username deve conter apenas letras, números e underscore")
    private String username;
    
    @NotBlank(message = "Telefone é obrigatório")
    @Pattern(regexp = "^\\(?[1-9]{2}\\)?[0-9]{4,5}-?[0-9]{4}$", message = "Telefone deve ter formato válido")
    private String phone;
    
    @Size(max = 200, message = "Endereço deve ter no máximo 200 caracteres")
    private String address;
    
    @Pattern(regexp = "^[0-9]{3}\\.?[0-9]{3}\\.?[0-9]{3}-?[0-9]{2}$", message = "CPF deve ter formato válido")
    private String cpf;
}
