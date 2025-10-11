package com.vynlotaste.mapper;

import com.vynlotaste.dto.FiscalDocumentRequestDto;
import com.vynlotaste.dto.FiscalDocumentResponseDto;
import com.vynlotaste.entity.FiscalDocument;
import org.mapstruct.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {DateTimeMapper.class}
)
@Component
public interface FiscalDocumentMapper {
    
    @Mapping(target = "hasXmlContent", expression = "java(fiscalDocument.hasXmlContent())")
    @Mapping(target = "xmlContent", ignore = true) // XML só incluído quando solicitado explicitamente
    @Named("toResponseDto")
    FiscalDocumentResponseDto toResponseDto(FiscalDocument fiscalDocument);
    
    @Mapping(target = "hasXmlContent", expression = "java(fiscalDocument.hasXmlContent())")
    @Mapping(target = "xmlContent", source = "xmlContent") // Incluir XML quando solicitado
    @Named("toResponseDtoWithXml")
    FiscalDocumentResponseDto toResponseDtoWithXml(FiscalDocument fiscalDocument);
    
    @Named("toResponseDtoList")
    @IterableMapping(qualifiedByName = "toResponseDto")
    List<FiscalDocumentResponseDto> toResponseDtoList(List<FiscalDocument> fiscalDocuments);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", defaultValue = "PENDING")
    @Mapping(target = "sefazStatus", defaultValue = "PENDING")
    FiscalDocument toEntity(FiscalDocumentRequestDto dto);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(FiscalDocumentRequestDto dto, @MappingTarget FiscalDocument fiscalDocument);
}