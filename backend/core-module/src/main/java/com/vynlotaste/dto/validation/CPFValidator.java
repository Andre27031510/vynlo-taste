package com.vynlotaste.dto.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CPFValidator implements ConstraintValidator<CPF, String> {

    @Override
    public boolean isValid(String cpf, ConstraintValidatorContext context) {
        if (cpf == null || cpf.trim().isEmpty()) {
            return true; // Deixa @NotNull validar se é obrigatório
        }
        
        // Remove formatação
        cpf = cpf.replaceAll("[^0-9]", "");
        
        // Verifica se tem 11 dígitos
        if (cpf.length() != 11) {
            return false;
        }
        
        // Verifica se todos os dígitos são iguais
        if (cpf.matches("(\\d)\\1{10}")) {
            return false;
        }
        
        // Calcula primeiro dígito verificador
        int sum = 0;
        for (int i = 0; i < 9; i++) {
            sum += Character.getNumericValue(cpf.charAt(i)) * (10 - i);
        }
        int firstDigit = 11 - (sum % 11);
        if (firstDigit >= 10) firstDigit = 0;
        
        // Calcula segundo dígito verificador
        sum = 0;
        for (int i = 0; i < 10; i++) {
            sum += Character.getNumericValue(cpf.charAt(i)) * (11 - i);
        }
        int secondDigit = 11 - (sum % 11);
        if (secondDigit >= 10) secondDigit = 0;
        
        // Verifica se os dígitos calculados conferem
        return Character.getNumericValue(cpf.charAt(9)) == firstDigit &&
               Character.getNumericValue(cpf.charAt(10)) == secondDigit;
    }
}