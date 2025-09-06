package com.vynlotaste.dto.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class BrazilianPhoneValidator implements ConstraintValidator<BrazilianPhone, String> {

    @Override
    public boolean isValid(String phone, ConstraintValidatorContext context) {
        if (phone == null || phone.trim().isEmpty()) {
            return true; // Deixa @NotNull validar se é obrigatório
        }
        
        // Remove formatação
        phone = phone.replaceAll("[^0-9]", "");
        
        // Verifica se tem 10 ou 11 dígitos (com DDD)
        if (phone.length() != 10 && phone.length() != 11) {
            return false;
        }
        
        // Verifica se o DDD é válido (11-99)
        String ddd = phone.substring(0, 2);
        int dddInt = Integer.parseInt(ddd);
        if (dddInt < 11 || dddInt > 99) {
            return false;
        }
        
        // Para celular (11 dígitos), o terceiro dígito deve ser 9
        if (phone.length() == 11) {
            return phone.charAt(2) == '9';
        }
        
        // Para telefone fixo (10 dígitos), o terceiro dígito não pode ser 9
        return phone.charAt(2) != '9';
    }
}