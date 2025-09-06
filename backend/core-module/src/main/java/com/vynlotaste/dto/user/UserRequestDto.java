package com.vynlotaste.dto.user;

import com.vynlotaste.dto.validation.BrazilianPhone;
import com.vynlotaste.dto.validation.CPF;
import com.vynlotaste.dto.validation.ValidationGroups;
import com.vynlotaste.entity.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
// Lombok removido - usando getters/setters manuais
import org.hibernate.validator.constraints.Length;

// Getters/setters manuais
@Schema(description = "Dados para criação/atualização de usuário")
public class UserRequestDto {
    
    @NotNull(message = "Email não pode ser nulo", groups = {ValidationGroups.Create.class, ValidationGroups.Update.class})
    @NotBlank(message = "Email é obrigatório", groups = ValidationGroups.Create.class)
    @Email(message = "Email deve ter formato válido")
    @Size(min = 5, max = 100, message = "Email deve ter entre 5 e 100 caracteres")
    @Schema(description = "Email do usuário", example = "usuario@exemplo.com", required = true)
    private String email;
    
    @NotNull(message = "Username não pode ser nulo", groups = ValidationGroups.Create.class)
    @NotBlank(message = "Username é obrigatório", groups = ValidationGroups.Create.class)
    @Length(min = 3, max = 30, message = "Username deve ter entre 3 e 30 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username deve conter apenas letras, números e underscore")
    @Schema(description = "Nome de usuário único", example = "usuario123", required = true)
    private String username;
    
    @NotNull(message = "Nome não pode ser nulo", groups = {ValidationGroups.Create.class, ValidationGroups.Update.class})
    @NotBlank(message = "Nome é obrigatório", groups = ValidationGroups.Create.class)
    @Length(min = 2, max = 50, message = "Nome deve ter entre 2 e 50 caracteres")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s'.-]+$", message = "Nome deve conter apenas letras, espaços, apóstrofes, pontos e hífens")
    @Schema(description = "Primeiro nome", example = "João", required = true)
    private String firstName;
    
    @NotNull(message = "Sobrenome não pode ser nulo", groups = {ValidationGroups.Create.class, ValidationGroups.Update.class})
    @NotBlank(message = "Sobrenome é obrigatório", groups = ValidationGroups.Create.class)
    @Length(min = 2, max = 50, message = "Sobrenome deve ter entre 2 e 50 caracteres")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s'.-]+$", message = "Sobrenome deve conter apenas letras, espaços, apóstrofes, pontos e hífens")
    @Schema(description = "Sobrenome", example = "Silva", required = true)
    private String lastName;
    
    @BrazilianPhone
    @Schema(description = "Telefone brasileiro no formato (XX) XXXXX-XXXX", example = "(11) 99999-9999")
    private String phone;
    
    @Length(max = 200, message = "Endereço deve ter no máximo 200 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9À-ÿ\\s,.'-]+$", message = "Endereço contém caracteres inválidos")
    @Schema(description = "Endereço completo", example = "Rua Exemplo, 123, Bairro, Cidade - SP")
    private String address;
    
    @NotNull(message = "Role é obrigatório", groups = {ValidationGroups.Create.class, ValidationGroups.Admin.class})
    @Schema(description = "Papel do usuário no sistema", example = "CUSTOMER", required = true, allowableValues = {"ADMIN", "MANAGER", "STAFF", "CUSTOMER", "DRIVER"})
    private UserRole role;
    
    @CPF
    @Schema(description = "CPF brasileiro no formato XXX.XXX.XXX-XX", example = "123.456.789-00")
    private String cpf;
    
    @Schema(description = "Status ativo do usuário", example = "true", defaultValue = "true")
    private Boolean active;
    
    @Length(max = 500, message = "URL da imagem deve ter no máximo 500 caracteres")
    @Pattern(regexp = "^(https?://)?[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(/.*)?$", message = "URL da imagem inválida")
    @Schema(description = "URL da imagem de perfil", example = "https://exemplo.com/avatar.jpg")
    private String profileImage;
    
    @Length(max = 1000, message = "Preferências devem ter no máximo 1000 caracteres")
    @Schema(description = "Preferências do usuário em formato JSON", example = "{\"theme\": \"dark\", \"language\": \"pt-BR\"}")
    private String preferences;

    // Getters e Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }

    public String getPreferences() { return preferences; }
    public void setPreferences(String preferences) { this.preferences = preferences; }
}