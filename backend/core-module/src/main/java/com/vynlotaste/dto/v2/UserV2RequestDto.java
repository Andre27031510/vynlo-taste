package com.vynlotaste.dto.v2;

import com.vynlotaste.dto.validation.*;
import com.vynlotaste.entity.UserRole;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserV2RequestDto {

    @NotBlank(message = "Email é obrigatório", groups = {ValidationGroups.Create.class})
    @Email(message = "Email deve ter formato válido")
    @Size(max = 100, message = "Email deve ter no máximo 100 caracteres")
    private String email;

    @NotBlank(message = "Username é obrigatório", groups = {ValidationGroups.Create.class})
    @Size(min = 3, max = 30, message = "Username deve ter entre 3 e 30 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username deve conter apenas letras, números e underscore")
    private String username;

    @NotBlank(message = "Nome é obrigatório", groups = {ValidationGroups.Create.class})
    @Size(min = 2, max = 50, message = "Nome deve ter entre 2 e 50 caracteres")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s]+$", message = "Nome deve conter apenas letras")
    private String firstName;

    @NotBlank(message = "Sobrenome é obrigatório", groups = {ValidationGroups.Create.class})
    @Size(min = 2, max = 50, message = "Sobrenome deve ter entre 2 e 50 caracteres")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s]+$", message = "Sobrenome deve conter apenas letras")
    private String lastName;

    @BrazilianPhone
    private String phone;

    @Size(max = 200, message = "Endereço deve ter no máximo 200 caracteres")
    private String address;

    @CPF
    private String cpf;

    @NotNull(message = "Papel do usuário é obrigatório", groups = {ValidationGroups.Admin.class})
    private UserRole role;

    private Boolean active;
    private Boolean emailVerified;
    private String profileImage;
    private String preferences;
    
    // Novos campos da v2
    private String birthDate;
    private String gender;
    private String occupation;
    private Boolean marketingConsent;
}