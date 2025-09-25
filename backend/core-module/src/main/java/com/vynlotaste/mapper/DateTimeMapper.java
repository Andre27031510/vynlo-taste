package com.vynlotaste.mapper;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring")
@Component
public interface DateTimeMapper {
    
    DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
    DateTimeFormatter DISPLAY_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    
    default String toIsoString(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(ISO_FORMATTER) : null;
    }
    
    default String toDisplayString(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DISPLAY_FORMATTER) : null;
    }
    
    default LocalDateTime fromIsoString(String dateTimeString) {
        return dateTimeString != null ? LocalDateTime.parse(dateTimeString, ISO_FORMATTER) : null;
    }
}