package com.vynlotaste.context;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * ============================================================================
 * TenantContext - Contexto de Thread para Multi-Tenancy
 * ============================================================================
 * 
 * CONTEXTO: Armazena tenant_id do usuário logado na thread atual
 * TECNOLOGIA: ThreadLocal (isolamento por requisição HTTP)
 * CICLO DE VIDA: Set no Filter → Usado nos Services → Clear no finally
 * 
 * FLUXO DE REQUISIÇÃO:
 * 1. JwtAuthenticationFilter extrai tenantId do JWT
 * 2. TenantContext.setCurrentTenantId(tenantId)
 * 3. Services/Repositories usam TenantContext.getCurrentTenantId()
 * 4. AOP intercepta queries e adiciona WHERE tenant_id = ?
 * 5. TenantContext.clear() no finally do Filter
 * 
 * SEGURANÇA:
 * - Super Admins: tenantId = null (acesso global, sem filtro)
 * - Clientes normais: tenantId != null (acesso restrito ao seu tenant)
 * 
 * IMPORTANTE:
 * - SEMPRE fazer clear() no finally para evitar memory leak
 * - ThreadLocal persiste entre requisições se não limpar
 * - Em ambientes async (Kafka, WebFlux), usar Context API
 * 
 * @version 1.0.0
 * @author Vynlo Tech - Multi-Tenancy Implementation
 * @created 2025-10-17
 * ============================================================================
 */
public class TenantContext {

    private static final Logger logger = LoggerFactory.getLogger(TenantContext.class);

    /**
     * ThreadLocal para armazenar tenant_id da thread atual
     * Cada thread HTTP tem seu próprio valor isolado
     */
    private static final ThreadLocal<Long> CURRENT_TENANT = new ThreadLocal<>();

    /**
     * ThreadLocal para armazenar se usuário é Super Admin
     * Super Admins não têm tenant_id (podem ver todos os dados)
     */
    private static final ThreadLocal<Boolean> IS_SUPER_ADMIN = new ThreadLocal<>();

    // ============================================================================
    // MÉTODOS PÚBLICOS
    // ============================================================================

    /**
     * Define o tenant_id do usuário logado na thread atual
     * THREAD-SAFE para sistemas de alta concorrência
     * 
     * @param tenantId ID do tenant (null para Super Admins)
     */
    public static void setCurrentTenantId(Long tenantId) {
        // Validação de segurança
        if (tenantId != null && tenantId <= 0) {
            throw new IllegalArgumentException("SECURITY: tenant_id deve ser positivo: " + tenantId);
        }
        
        CURRENT_TENANT.set(tenantId);
        logger.debug("TenantContext: tenant_id definido = {} [thread={}]", tenantId, Thread.currentThread().getName());
    }

    /**
     * Obtém o tenant_id do usuário logado na thread atual
     * THREAD-SAFE com validação de integridade
     * 
     * @return tenant_id ou null (Super Admin ou não autenticado)
     */
    public static Long getCurrentTenantId() {
        Long tenantId = CURRENT_TENANT.get();
        
        // Validação de integridade para sistemas críticos
        if (tenantId != null && tenantId <= 0) {
            logger.error("SECURITY BREACH: tenant_id inválido detectado = {} [thread={}]", 
                        tenantId, Thread.currentThread().getName());
            clear(); // Limpar contexto corrompido
            throw new IllegalStateException("SECURITY: Contexto de tenant corrompido");
        }
        
        logger.trace("TenantContext: tenant_id obtido = {} [thread={}]", tenantId, Thread.currentThread().getName());
        return tenantId;
    }

    /**
     * Define se o usuário atual é Super Admin
     * 
     * @param isSuperAdmin true se Super Admin, false caso contrário
     */
    public static void setIsSuperAdmin(boolean isSuperAdmin) {
        IS_SUPER_ADMIN.set(isSuperAdmin);
        logger.debug("TenantContext: isSuperAdmin = {}", isSuperAdmin);
    }

    /**
     * Verifica se o usuário atual é Super Admin
     * 
     * @return true se Super Admin, false caso contrário
     */
    public static boolean isSuperAdmin() {
        Boolean superAdmin = IS_SUPER_ADMIN.get();
        return Boolean.TRUE.equals(superAdmin);
    }

    /**
     * Limpa o contexto da thread atual
     * THREAD-SAFE com auditoria para sistemas críticos
     * 
     * CRÍTICO: SEMPRE chamar no finally do Filter para evitar memory leak!
     * ThreadLocal persiste entre requisições se não limpar
     */
    public static void clear() {
        Long tenantId = CURRENT_TENANT.get();
        Boolean superAdmin = IS_SUPER_ADMIN.get();
        String threadName = Thread.currentThread().getName();
        
        try {
            CURRENT_TENANT.remove();
            IS_SUPER_ADMIN.remove();
            
            logger.debug("TenantContext: contexto limpo (tenant_id={}, isSuperAdmin={}) [thread={}]", 
                        tenantId, superAdmin, threadName);
        } catch (Exception e) {
            logger.error("CRITICAL: Erro ao limpar TenantContext [thread={}]", threadName, e);
            // Força limpeza mesmo com erro
            try {
                CURRENT_TENANT.remove();
                IS_SUPER_ADMIN.remove();
            } catch (Exception ignored) {
                logger.error("CRITICAL: Falha total na limpeza do TenantContext [thread={}]", threadName);
            }
        }
    }

    /**
     * Verifica se há um tenant definido no contexto
     * 
     * @return true se tenant_id está definido, false caso contrário
     */
    public static boolean hasTenant() {
        return CURRENT_TENANT.get() != null;
    }

    /**
     * Verifica se o contexto está vazio (nenhum tenant ou super admin definido)
     * 
     * @return true se contexto vazio, false caso contrário
     */
    public static boolean isEmpty() {
        return CURRENT_TENANT.get() == null && IS_SUPER_ADMIN.get() == null;
    }

    /**
     * Obtém informações de debug do contexto atual
     * 
     * @return String com informações do contexto
     */
    public static String getDebugInfo() {
        Long tenantId = CURRENT_TENANT.get();
        Boolean superAdmin = IS_SUPER_ADMIN.get();
        
        if (Boolean.TRUE.equals(superAdmin)) {
            return "TenantContext{isSuperAdmin=true, tenantId=null, access=GLOBAL}";
        } else if (tenantId != null) {
            // Sanitização para prevenir XSS
            return String.format("TenantContext{isSuperAdmin=false, tenantId=%d, access=RESTRICTED}", tenantId);
        } else {
            return "TenantContext{isSuperAdmin=false, tenantId=null, access=UNAUTHENTICATED}";
        }
    }

    // ============================================================================
    // MÉTODOS DE VALIDAÇÃO
    // ============================================================================

    /**
     * Valida se o tenant está ativo no contexto
     * Lança exceção se tenant não estiver definido e usuário não for Super Admin
     * 
     * @throws IllegalStateException se tenant não definido e não é Super Admin
     */
    public static void validateTenantContext() {
        if (!isSuperAdmin() && !hasTenant()) {
            throw new IllegalStateException(
                "Tenant não definido no contexto. Verifique se JwtAuthenticationFilter está configurado corretamente."
            );
        }
    }

    /**
     * Valida se o usuário tem permissão para acessar o tenant especificado
     * Super Admins têm acesso a qualquer tenant
     * Clientes normais só têm acesso ao seu próprio tenant
     * 
     * @param tenantId ID do tenant a validar
     * @return true se tem permissão, false caso contrário
     */
    public static boolean canAccessTenant(Long tenantId) {
        if (tenantId == null) {
            return false;
        }
        
        // Super Admin pode acessar qualquer tenant
        if (isSuperAdmin()) {
            return true;
        }
        
        // Cliente normal só pode acessar seu próprio tenant
        Long currentTenantId = getCurrentTenantId();
        return tenantId.equals(currentTenantId);
    }
}

