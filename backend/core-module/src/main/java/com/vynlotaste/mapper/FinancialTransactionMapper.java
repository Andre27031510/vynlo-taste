package com.vynlotaste.mapper;

import com.vynlotaste.dto.financial.FinancialTransactionDto;
import com.vynlotaste.entity.FinancialTransaction;
import org.mapstruct.*;

import java.util.List;

/**
 * Mapper para FinancialTransaction entity ↔ DTOs
 * v2.1.3 - Implementação completa do fluxo financeiro
 * Baseado em melhores práticas TOTVS/SAP/Oracle
 */
@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface FinancialTransactionMapper {

    /**
     * Converter entity para DTO de resposta
     */
    FinancialTransactionDto.Response toResponseDto(FinancialTransaction transaction);

    /**
     * Converter lista de entities para lista de DTOs de resposta
     */
    List<FinancialTransactionDto.Response> toResponseDtoList(List<FinancialTransaction> transactions);

    /**
     * Converter DTO de criação para entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "PENDING")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deletedBy", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    FinancialTransaction toEntity(FinancialTransactionDto.CreateRequest request);

    /**
     * Converter DTO de atualização para entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deletedBy", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    void updateEntityFromDto(FinancialTransactionDto.UpdateRequest request, @MappingTarget FinancialTransaction entity);

    /**
     * Converter DTO para entity (método completo)
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deletedBy", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    FinancialTransaction toEntityFromDto(FinancialTransactionDto dto);
}
