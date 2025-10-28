package com.vynlotaste.service.church;

import com.vynlotaste.entity.church.Member;
import com.vynlotaste.entity.church.CellGroup;
import com.vynlotaste.entity.church.Ministry;
import com.vynlotaste.repository.church.MemberRepository;
import com.vynlotaste.repository.church.CellGroupRepository;
import com.vynlotaste.repository.church.MinistryRepository;
import com.vynlotaste.context.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.List;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

/**
 * ============================================================================
 * Service para Member - EKKLESIA
 * ============================================================================
 * 
 * SEGURANÇA MULTI-TENANCY:
 * - Todos os métodos validam tenant_id
 * - Igreja X não acessa dados de Igreja Y
 * - Super Admin vê TODOS os membros
 * 
 * @version 1.0.0
 * @author Vynlo Tech - EKKLESIA Implementation
 * @created 2025-10-28
 * ============================================================================
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {
    
    private final MemberRepository memberRepository;
    private final CellGroupRepository cellGroupRepository;
    private final MinistryRepository ministryRepository;
    
    /**
     * Listar todos os membros com paginação
     * MULTI-TENANCY: Filtra por tenant_id
     */
    @Transactional(readOnly = true)
    public Page<Member> findAll(Pageable pageable) {
        Long tenantId = TenantContext.getCurrentTenantId();
        
        if (tenantId == null) {
            if (TenantContext.isSuperAdmin()) {
                log.debug("🔑 Super Admin: retornando TODOS os membros");
                return memberRepository.findAll(pageable);
            }
            log.warn("⚠️ Tenant não definido - retornando página vazia");
            return Page.empty(pageable);
        }
        
        log.debug("👤 Cliente (tenant_id={}): retornando membros do tenant", tenantId);
        return memberRepository.findAllByTenantId(tenantId, pageable);
    }
    
    /**
     * Buscar membro por ID
     * MULTI-TENANCY: Valida tenant_id
     */
    @Transactional(readOnly = true)
    public Member findById(Long id) {
        Long tenantId = TenantContext.getCurrentTenantId();
        
        if (TenantContext.isSuperAdmin()) {
            return memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Membro não encontrado: " + id));
        }
        
        if (tenantId == null) {
            throw new RuntimeException("Tenant não definido - operação negada");
        }
        
        return memberRepository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new RuntimeException("Membro não encontrado ou sem acesso: " + id));
    }
    
    /**
     * Criar novo membro
     * MULTI-TENANCY: Define tenant_id automaticamente
     */
    @Transactional
    public Member create(Member member) {
        Long tenantId = TenantContext.getCurrentTenantId();
        
        if (tenantId == null && !TenantContext.isSuperAdmin()) {
            throw new RuntimeException("Tenant não definido - operação negada");
        }
        
        member.setTenantId(tenantId);
        member.setJoinDate(LocalDate.now());
        
        // Validar se célula e ministério existem e pertencem ao mesmo tenant
        if (member.getCellGroupId() != null) {
            CellGroup cellGroup = cellGroupRepository.findByIdAndTenantId(member.getCellGroupId(), tenantId)
                .orElseThrow(() -> new RuntimeException("Célula não encontrada ou sem acesso"));
            member.setCellGroup(cellGroup);
        }
        
        if (member.getMinistryId() != null) {
            Ministry ministry = ministryRepository.findByIdAndTenantId(member.getMinistryId(), tenantId)
                .orElseThrow(() -> new RuntimeException("Ministério não encontrado ou sem acesso"));
            member.setMinistry(ministry);
        }
        
        Member saved = memberRepository.save(member);
        log.info("✅ Membro criado: {} (tenant_id={})", saved.getName(), saved.getTenantId());
        
        return saved;
    }
    
    /**
     * Atualizar membro existente
     * MULTI-TENANCY: Valida tenant_id
     */
    @Transactional
    public Member update(Long id, Member member) {
        Member existing = findById(id); // Valida tenant_id
        
        existing.setName(member.getName());
        existing.setEmail(member.getEmail());
        existing.setPhone(member.getPhone());
        existing.setBirthDate(member.getBirthDate());
        existing.setCpf(member.getCpf());
        existing.setAddress(member.getAddress());
        existing.setSpiritualStatus(member.getSpiritualStatus());
        existing.setStatus(member.getStatus());
        existing.setCellGroupId(member.getCellGroupId());
        existing.setMinistryId(member.getMinistryId());
        existing.setNotes(member.getNotes());
        
        Member updated = memberRepository.save(existing);
        log.info("✅ Membro atualizado: {} (tenant_id={})", updated.getName(), updated.getTenantId());
        
        return updated;
    }
    
    /**
     * Deletar membro (soft delete)
     * MULTI-TENANCY: Valida tenant_id
     */
    @Transactional
    public void delete(Long id) {
        Member existing = findById(id); // Valida tenant_id
        
        existing.setDeletedAt(java.time.LocalDateTime.now());
        existing.setStatus("INACTIVE");
        
        memberRepository.save(existing);
        log.info("✅ Membro deletado: {} (tenant_id={})", existing.getName(), existing.getTenantId());
    }
    
    /**
     * Buscar membros com filtros avançados
     */
    @Transactional(readOnly = true)
    public Page<Member> findByFilters(String status, String spiritualStatus, Long cellGroupId, Long ministryId, Pageable pageable) {
        Long tenantId = TenantContext.getCurrentTenantId();
        
        if (tenantId == null && !TenantContext.isSuperAdmin()) {
            return Page.empty(pageable);
        }
        
        return memberRepository.findByTenantIdWithFilters(
            tenantId, status, spiritualStatus, cellGroupId, ministryId, pageable
        );
    }
    
    /**
     * Contar membros ativos
     */
    @Transactional(readOnly = true)
    public Long countActiveMembers() {
        Long tenantId = TenantContext.getCurrentTenantId();
        
        if (tenantId == null) {
            return 0L;
        }
        
        return memberRepository.countActiveMembersByTenantId(tenantId);
    }

    /**
     * Importar membros via arquivo Excel (.xlsx)
     */
    @Transactional
    public com.vynlotaste.controller.church.MemberController.ImportResultDto importFromExcel(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return new com.vynlotaste.controller.church.MemberController.ImportResultDto(0, 0, "Arquivo vazio");
        }

        Long tenantId = TenantContext.getCurrentTenantId();
        if (tenantId == null && !TenantContext.isSuperAdmin()) {
            throw new RuntimeException("Tenant não definido");
        }

        int imported = 0;
        int skipped = 0;

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            boolean first = true;
            for (Row row : sheet) {
                if (first) { first = false; continue; } // pular cabeçalho

                String name = getStringCell(row, 0);
                String birthDateStr = getStringCell(row, 1);
                String baptismDateStr = getStringCell(row, 2);
                String phone = getStringCell(row, 3);
                String address = getStringCell(row, 4);

                if (name == null || name.isBlank()) { skipped++; continue; }

                Member m = new Member();
                m.setTenantId(tenantId);
                m.setName(name);
                m.setPhone(phone);
                m.setAddress(address);
                if (birthDateStr != null && !birthDateStr.isBlank()) {
                    m.setBirthDate(LocalDate.parse(birthDateStr));
                }
                if (baptismDateStr != null && !baptismDateStr.isBlank()) {
                    m.setBaptismDate(LocalDate.parse(baptismDateStr));
                }
                m.setStatus("ACTIVE");
                m.setSpiritualStatus("NEW_BELIEVER");
                memberRepository.save(m);
                imported++;
            }
        } catch (Exception e) {
            throw new RuntimeException("Falha ao importar Excel: " + e.getMessage(), e);
        }

        return new com.vynlotaste.controller.church.MemberController.ImportResultDto(imported, skipped, "Importação concluída");
    }

    private String getStringCell(Row row, int idx) {
        Cell cell = row.getCell(idx);
        if (cell == null) return null;
        cell.setCellType(CellType.STRING);
        return cell.getStringCellValue();
    }

    /**
     * Exportar membros em Excel (.xlsx)
     */
    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> exportToExcel() {
        Long tenantId = TenantContext.getCurrentTenantId();
        List<Member> members;
        if (TenantContext.isSuperAdmin()) {
            members = memberRepository.findAll();
        } else {
            if (tenantId == null) throw new RuntimeException("Tenant não definido");
            members = memberRepository.findAllByTenantIdAndStatusAndDeletedAtIsNull(tenantId, "ACTIVE");
        }

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Members");
            int rowIdx = 0;
            Row header = sheet.createRow(rowIdx++);
            header.createCell(0).setCellValue("Nome");
            header.createCell(1).setCellValue("DataNascimento");
            header.createCell(2).setCellValue("DataBatismo");
            header.createCell(3).setCellValue("Telefone");
            header.createCell(4).setCellValue("Endereco");

            for (Member m : members) {
                Row r = sheet.createRow(rowIdx++);
                r.createCell(0).setCellValue(nullToEmpty(m.getName()));
                r.createCell(1).setCellValue(m.getBirthDate() != null ? m.getBirthDate().toString() : "");
                r.createCell(2).setCellValue(m.getBaptismDate() != null ? m.getBaptismDate().toString() : "");
                r.createCell(3).setCellValue(nullToEmpty(m.getPhone()));
                r.createCell(4).setCellValue(nullToEmpty(m.getAddress()));
            }

            workbook.write(out);
            byte[] bytes = out.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=members.xlsx");

            return ResponseEntity.ok().headers(headers).body(bytes);
        } catch (Exception e) {
            throw new RuntimeException("Falha ao exportar Excel: " + e.getMessage(), e);
        }
    }

    private String nullToEmpty(String s) { return s == null ? "" : s; }
}

