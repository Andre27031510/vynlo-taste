package com.vynlotaste.dto.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.util.StringUtils;

import java.util.regex.Pattern;

public class SanitizedInputValidator implements ConstraintValidator<SanitizedInput, String> {
    
    private boolean allowBasicPunctuation;
    private boolean allowAccents;
    private boolean allowNumbers;
    
    // Padrões para detectar possíveis ataques
    private static final Pattern[] DANGEROUS_PATTERNS = {
        Pattern.compile(".*<script.*?>.*</script>.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*javascript:.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*on\\w+\\s*=.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*<iframe.*?>.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*<object.*?>.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*<embed.*?>.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*<link.*?>.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*<meta.*?>.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*\\bSELECT\\b.*\\bFROM\\b.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*\\bINSERT\\b.*\\bINTO\\b.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*\\bUPDATE\\b.*\\bSET\\b.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*\\bDELETE\\b.*\\bFROM\\b.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*\\bDROP\\b.*\\bTABLE\\b.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*\\bUNION\\b.*\\bSELECT\\b.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*\\bEXEC\\b.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*\\bEVAL\\b.*", Pattern.CASE_INSENSITIVE)
    };
    
    @Override
    public void initialize(SanitizedInput constraintAnnotation) {
        this.allowBasicPunctuation = constraintAnnotation.allowBasicPunctuation();
        this.allowAccents = constraintAnnotation.allowAccents();
        this.allowNumbers = constraintAnnotation.allowNumbers();
    }
    
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (!StringUtils.hasText(value)) {
            return true; // Deixa @NotNull/@NotBlank validar se é obrigatório
        }
        
        // Verifica padrões perigosos
        for (Pattern pattern : DANGEROUS_PATTERNS) {
            if (pattern.matcher(value).matches()) {
                return false;
            }
        }
        
        // Constrói regex baseado nas opções
        StringBuilder regexBuilder = new StringBuilder("^[");
        
        // Sempre permite letras básicas
        regexBuilder.append("a-zA-Z");
        
        // Permite acentos se habilitado
        if (allowAccents) {
            regexBuilder.append("À-ÿ\\u00C0-\\u017F");
        }
        
        // Permite números se habilitado
        if (allowNumbers) {
            regexBuilder.append("0-9");
        }
        
        // Sempre permite espaços
        regexBuilder.append("\\s");
        
        // Permite pontuação básica se habilitado
        if (allowBasicPunctuation) {
            regexBuilder.append(",.!?'\"()-");
        }
        
        regexBuilder.append("]+$");
        
        Pattern allowedPattern = Pattern.compile(regexBuilder.toString());
        return allowedPattern.matcher(value).matches();
    }
}