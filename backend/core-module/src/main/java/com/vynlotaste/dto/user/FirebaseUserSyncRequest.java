package com.vynlotaste.dto.user;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FirebaseUserSyncRequest {
    
    @NotBlank(message = "Firebase UID é obrigatório")
    private String firebaseUid;
    
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    private String email;
    
    private String displayName;
    
    @NotNull(message = "Email verificado é obrigatório")
    private Boolean emailVerified;
    
    private String phoneNumber;
    
    private String photoURL;
    
    private String creationTime;
    
    private String lastSignInTime;
}
