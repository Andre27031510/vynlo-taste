package com.vynlotaste.mapper;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.regex.Pattern;

@Mapper(componentModel = "spring")
@Component
public class ValidationMapper {
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\(?[1-9]{2}\\)?[0-9]{4,5}-?[0-9]{4}$");
    private static final Pattern CPF_PATTERN = Pattern.compile("^[0-9]{3}\\.?[0-9]{3}\\.?[0-9]{3}-?[0-9]{2}$");
    
    public boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }
    
    public boolean isValidPhone(String phone) {
        return phone != null && PHONE_PATTERN.matcher(phone).matches();
    }
    
    public boolean isValidCPF(String cpf) {
        return cpf != null && CPF_PATTERN.matcher(cpf).matches();
    }
    
    public boolean isValidPrice(BigDecimal price) {
        return price != null && price.compareTo(BigDecimal.ZERO) > 0;
    }
    
    public String sanitizeString(String input) {
        if (input == null) return null;
        return input.trim().replaceAll("\\s+", " ");
    }
    
    public String formatCPF(String cpf) {
        if (cpf == null) return null;
        String numbers = cpf.replaceAll("[^0-9]", "");
        if (numbers.length() == 11) {
            return numbers.substring(0, 3) + "." + 
                   numbers.substring(3, 6) + "." + 
                   numbers.substring(6, 9) + "-" + 
                   numbers.substring(9);
        }
        return cpf;
    }
    
    public String formatPhone(String phone) {
        if (phone == null) return null;
        String numbers = phone.replaceAll("[^0-9]", "");
        if (numbers.length() == 11) {
            return "(" + numbers.substring(0, 2) + ") " + 
                   numbers.substring(2, 7) + "-" + 
                   numbers.substring(7);
        } else if (numbers.length() == 10) {
            return "(" + numbers.substring(0, 2) + ") " + 
                   numbers.substring(2, 6) + "-" + 
                   numbers.substring(6);
        }
        return phone;
    }
}