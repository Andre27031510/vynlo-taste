package com.vynlotaste.repository;

import com.vynlotaste.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================================
 * TenantRepository - Acesso a dados de tenants (Multi-Tenancy)
 * ============================================================================
 * 
 * CONTEXTO: Repository para gerenciar tenants (clientes do sistema)
 * USO: ClientManagementController, TenantService, JwtAuthenticationFilter
 * 
 * QUERIES PRINCIPAIS:
 * - findByFirebaseUid: Buscar tenant pelo UID do admin Firebase
 * - findByCnpj: Buscar tenant pelo CNPJ (validação de duplicação)
 * - findByStatus: Listar tenants ativos/suspensos/deletados
 * - findByVynloProduct: Listar tenants de um produto específico
 * 
 * SEGURANÇA:
 * - Super Admins podem ver TODOS os tenants
 * - Clientes normais vêem APENAS seu próprio tenant
 * 
 * @version 1.0.0
 * @author Vynlo Tech - Multi-Tenancy Implementation
 * @created 2025-10-17
 * ============================================================================
 */
@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {

    /**
     * Buscar tenant pelo Firebase UID do admin
     * USO: JwtAuthenticationFilter.extractTenantId(FirebaseToken)
     * IMPORTANTE: Cada admin Firebase tem exatamente 1 tenant
     */
    Optional<Tenant> findByFirebaseUid(String firebaseUid);

    /**
     * Verificar se Firebase UID já existe (validação antes de criar)
     * USO: ClientManagementController.createClient()
     */
    boolean existsByFirebaseUid(String firebaseUid);

    /**
     * Buscar tenant pelo CNPJ (validação de duplicação)
     * USO: ClientManagementController.createClient()
     */
    Optional<Tenant> findByCnpj(String cnpj);

    /**
     * Verificar se CNPJ já existe (validação antes de criar)
     */
    boolean existsByCnpj(String cnpj);

    /**
     * Listar tenants por status
     * USO: Super Admin dashboard (ver tenants ativos, suspensos, etc)
     */
    List<Tenant> findByStatus(String status);

    /**
     * Listar tenants ativos (excluindo deletados)
     * USO: Super Admin dashboard (lista principal)
     */
    @Query("SELECT t FROM Tenant t WHERE t.status = 'ACTIVE' AND t.deletedAt IS NULL")
    List<Tenant> findAllActive();

    /**
     * Listar tenants por produto Vynlo
     * USO: Analytics, relatórios de uso por produto
     */
    List<Tenant> findByVynloProduct(String vynloProduct);

    /**
     * Listar tenants por tipo de cliente
     * USO: Analytics, relatórios de uso por tipo de negócio
     */
    List<Tenant> findByClientType(String clientType);

    /**
     * Buscar tenant pelo nome da empresa (case insensitive)
     * USO: Super Admin busca/filtro
     */
    @Query("SELECT t FROM Tenant t WHERE LOWER(t.companyName) LIKE LOWER(CONCAT('%', :companyName, '%'))")
    List<Tenant> findByCompanyNameContaining(@Param("companyName") String companyName);

    /**
     * Contar tenants ativos
     * USO: Super Admin dashboard (métricas)
     */
    @Query("SELECT COUNT(t) FROM Tenant t WHERE t.status = 'ACTIVE' AND t.deletedAt IS NULL")
    long countActive();

    /**
     * Contar tenants por produto
     * USO: Analytics, relatórios de penetração de mercado
     */
    @Query("SELECT COUNT(t) FROM Tenant t WHERE t.vynloProduct = :product AND t.status = 'ACTIVE'")
    long countByVynloProduct(@Param("product") String product);

    /**
     * Verificar se tenant está ativo
     * USO: Validação antes de permitir operações
     */
    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM Tenant t " +
           "WHERE t.id = :tenantId AND t.status = 'ACTIVE' AND t.deletedAt IS NULL")
    boolean isTenantActive(@Param("tenantId") Long tenantId);
}

