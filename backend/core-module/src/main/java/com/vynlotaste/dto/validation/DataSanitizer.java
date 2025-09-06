package com.vynlotaste.dto.validation;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.regex.Pattern;

@Component
public class DataSanitizer {
    
    // Padrões para limpeza
    private static final Pattern HTML_TAGS = Pattern.compile("<[^>]+>");
    private static final Pattern SCRIPT_TAGS = Pattern.compile("<script[^>]*>.*?</script>", Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
    private static final Pattern JAVASCRIPT = Pattern.compile("javascript:", Pattern.CASE_INSENSITIVE);
    private static final Pattern ON_EVENTS = Pattern.compile("on\\w+\\s*=", Pattern.CASE_INSENSITIVE);
    private static final Pattern SQL_KEYWORDS = Pattern.compile("\\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|EVAL)\\b", Pattern.CASE_INSENSITIVE);
    
    // Caracteres especiais para escape
    private static final String[][] ESCAPE_CHARS = {
        {"&", "&amp;"},
        {"<", "&lt;"},
        {">", "&gt;"},
        {"\"", "&quot;"},
        {"'", "&#x27;"},
        {"/", "&#x2F;"}
    };
    
    /**
     * Sanitiza texto removendo tags HTML e scripts maliciosos
     */
    public String sanitizeText(String input) {
        if (!StringUtils.hasText(input)) {
            return input;
        }
        
        String sanitized = input.trim();
        
        // Remove scripts
        sanitized = SCRIPT_TAGS.matcher(sanitized).replaceAll("");
        
        // Remove javascript:
        sanitized = JAVASCRIPT.matcher(sanitized).replaceAll("");
        
        // Remove event handlers
        sanitized = ON_EVENTS.matcher(sanitized).replaceAll("");
        
        // Remove tags HTML
        sanitized = HTML_TAGS.matcher(sanitized).replaceAll("");
        
        // Remove possíveis comandos SQL
        sanitized = SQL_KEYWORDS.matcher(sanitized).replaceAll("***");
        
        return sanitized;
    }
    
    /**
     * Escapa caracteres especiais para HTML
     */
    public String escapeHtml(String input) {
        if (!StringUtils.hasText(input)) {
            return input;
        }
        
        String escaped = input;
        for (String[] escapeChar : ESCAPE_CHARS) {
            escaped = escaped.replace(escapeChar[0], escapeChar[1]);
        }
        
        return escaped;
    }
    
    /**
     * Sanitiza email removendo caracteres perigosos
     */
    public String sanitizeEmail(String email) {
        if (!StringUtils.hasText(email)) {
            return email;
        }
        
        // Remove espaços e converte para minúsculo
        String sanitized = email.trim().toLowerCase();
        
        // Remove caracteres não permitidos em email
        sanitized = sanitized.replaceAll("[^a-zA-Z0-9@._+-]", "");
        
        return sanitized;
    }
    
    /**
     * Sanitiza telefone mantendo apenas números e alguns caracteres
     */
    public String sanitizePhone(String phone) {
        if (!StringUtils.hasText(phone)) {
            return phone;
        }
        
        // Mantém apenas números, parênteses, espaços e hífens
        return phone.replaceAll("[^0-9()\\s-]", "");
    }
    
    /**
     * Sanitiza CPF mantendo apenas números, pontos e hífens
     */
    public String sanitizeCpf(String cpf) {
        if (!StringUtils.hasText(cpf)) {
            return cpf;
        }
        
        // Mantém apenas números, pontos e hífens
        return cpf.replaceAll("[^0-9.-]", "");
    }
    
    /**
     * Sanitiza nome removendo caracteres especiais perigosos
     */
    public String sanitizeName(String name) {
        if (!StringUtils.hasText(name)) {
            return name;
        }
        
        String sanitized = sanitizeText(name);
        
        // Mantém apenas letras, espaços, acentos e alguns caracteres especiais
        sanitized = sanitized.replaceAll("[^a-zA-ZÀ-ÿ\\u00C0-\\u017F\\s'.-]", "");
        
        // Remove espaços múltiplos
        sanitized = sanitized.replaceAll("\\s+", " ");
        
        return sanitized.trim();
    }
    
    /**
     * Sanitiza endereço removendo caracteres perigosos
     */
    public String sanitizeAddress(String address) {
        if (!StringUtils.hasText(address)) {
            return address;
        }
        
        String sanitized = sanitizeText(address);
        
        // Mantém letras, números, espaços, acentos e pontuação básica
        sanitized = sanitized.replaceAll("[^a-zA-Z0-9À-ÿ\\u00C0-\\u017F\\s,.'-]", "");
        
        // Remove espaços múltiplos
        sanitized = sanitized.replaceAll("\\s+", " ");
        
        return sanitized.trim();
    }
    
    /**
     * Verifica se o texto contém conteúdo suspeito
     */
    public boolean containsSuspiciousContent(String input) {
        if (!StringUtils.hasText(input)) {
            return false;
        }
        
        String lowerInput = input.toLowerCase();
        
        // Verifica padrões suspeitos
        return lowerInput.contains("<script") ||
               lowerInput.contains("javascript:") ||
               lowerInput.contains("on") && lowerInput.contains("=") ||
               lowerInput.contains("select") && lowerInput.contains("from") ||
               lowerInput.contains("insert") && lowerInput.contains("into") ||
               lowerInput.contains("update") && lowerInput.contains("set") ||
               lowerInput.contains("delete") && lowerInput.contains("from") ||
               lowerInput.contains("drop") && lowerInput.contains("table") ||
               lowerInput.contains("union") && lowerInput.contains("select");
    }
}