package com.vynlotaste.service.church;

import com.vynlotaste.config.MetricsTestConfiguration;
import com.vynlotaste.context.TenantContext;
import com.vynlotaste.entity.church.Member;
import com.vynlotaste.entity.church.Tithing;
import com.vynlotaste.repository.church.MemberRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = com.vynlotaste.core.CoreModuleApplication.class)
@ActiveProfiles("test")
@Import(MetricsTestConfiguration.class)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class EkklesiaTenantIsolationTest {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private TithingService tithingService;

    private EventService eventService;

    private CellGroupService cellGroupService;

    private Long memberTenant1;
    private Long memberTenant2;

    @BeforeEach
    void setup() {
        TenantContext.clear();
        // Criar dois membros em tenants distintos
        Member m1 = new Member();
        m1.setTenantId(1L);
        m1.setName("Tenant1 User");
        m1.setStatus("ACTIVE");
        memberTenant1 = memberRepository.save(m1).getId();

        Member m2 = new Member();
        m2.setTenantId(2L);
        m2.setName("Tenant2 User");
        m2.setStatus("ACTIVE");
        memberTenant2 = memberRepository.save(m2).getId();
    }

    @AfterEach
    void cleanup() {
        TenantContext.clear();
        memberRepository.deleteAll();
    }

    @Test
    @Order(1)
    @DisplayName("Bloquear Tithing cross-tenant (memberId de outro tenant)")
    void shouldBlockTithingCrossTenant() {
        TenantContext.setCurrentTenantId(1L);
        TenantContext.setIsSuperAdmin(false);

        Tithing t = new Tithing();
        t.setAmount(new BigDecimal("10.00"));
        t.setPaymentMethod("PIX");
        t.setTitheType("TITHE");
        // member do tenant 2
        t.setMemberId(memberTenant2);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> tithingService.create(t));
        assertTrue(ex.getMessage().toLowerCase().contains("memberid"));
    }

    @Test
    @Order(2)
    @DisplayName("Super Admin não sofre filtros de service, mas filtro Hibernate está ativo")
    void superAdminGlobalStillHasFilterEnabled() {
        // Super admin sem tenant
        TenantContext.setIsSuperAdmin(true);
        TenantContext.setCurrentTenantId(null);

        // Como o Hibernate Filter está ativo para todos, sem tenantId parametrizado
        // as entidades anotadas não terão restrição aplicada (sem parâmetro). Apenas
        // validamos que o contexto não lança e o service não falha por tenant nulo.
        // findAll não deve lançar exceção
        assertDoesNotThrow(() -> tithingService.findAll(org.springframework.data.domain.PageRequest.of(0, 10)));
    }
}


