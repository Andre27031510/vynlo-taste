package com.vynlotaste.dto.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = SanitizedInputValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface SanitizedInput {
    String message() default "Entrada contém caracteres não permitidos";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    
    /**
     * Permite apenas caracteres alfanuméricos, espaços e pontuação básica
     */
    boolean allowBasicPunctuation() default true;
    
    /**
     * Permite caracteres acentuados
     */
    boolean allowAccents() default true;
    
    /**
     * Permite números
     */
    boolean allowNumbers() default true;
}