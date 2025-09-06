package com.vynlotaste.mapper;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring")
@Component
public class DateTimeMapper {
    
    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
    
    public String localDateTimeToString(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(ISO_FORMATTER) : null;
    }
    
    public LocalDateTime stringToLocalDateTime(String dateTime) {
        return dateTime != null && !dateTime.trim().isEmpty() 
            ? LocalDateTime.parse(dateTime, ISO_FORMATTER) 
            : null;
    }
}