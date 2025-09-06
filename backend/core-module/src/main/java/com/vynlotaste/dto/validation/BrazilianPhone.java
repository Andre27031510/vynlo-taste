package com.vynlotaste.dto.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = BrazilianPhoneValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface BrazilianPhone {
    String message() default "Telefone brasileiro inválido";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}