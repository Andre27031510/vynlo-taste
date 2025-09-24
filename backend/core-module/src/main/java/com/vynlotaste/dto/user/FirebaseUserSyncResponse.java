package com.vynlotaste.dto.user;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FirebaseUserSyncResponse {
    
    private Long id;
    private String firebaseUid;
    private String email;
    private String status;
    private String message;
    private Boolean alreadyExists;
    
    public static FirebaseUserSyncResponse success(Long userId, String firebaseUid, String email) {
        return FirebaseUserSyncResponse.builder()
            .id(userId)
            .firebaseUid(firebaseUid)
            .email(email)
            .status("SUCCESS")
            .message("Usuário sincronizado com sucesso")
            .alreadyExists(false)
            .build();
    }
    
    public static FirebaseUserSyncResponse alreadyExists(Long userId, String firebaseUid, String email) {
        return FirebaseUserSyncResponse.builder()
            .id(userId)
            .firebaseUid(firebaseUid)
            .email(email)
            .status("ALREADY_EXISTS")
            .message("Usuário já existe no sistema")
            .alreadyExists(true)
            .build();
    }
    
    public static FirebaseUserSyncResponse error(String message) {
        return FirebaseUserSyncResponse.builder()
            .status("ERROR")
            .message(message)
            .alreadyExists(false)
            .build();
    }
}
