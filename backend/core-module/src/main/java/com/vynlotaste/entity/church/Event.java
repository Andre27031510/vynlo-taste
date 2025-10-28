package com.vynlotaste.entity.church;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * ============================================================================
 * Entidade Event - Eventos/Cultos da Igreja (EKKLESIA)
 * ============================================================================
 */
@Entity
@Table(name = "events", indexes = {
    @Index(name = "idx_events_tenant_id", columnList = "tenantId"),
    @Index(name = "idx_events_organizer_id", columnList = "organizerId"),
    @Index(name = "idx_events_start_date", columnList = "startDate"),
    @Index(name = "idx_events_status", columnList = "status"),
    @Index(name = "idx_events_type", columnList = "eventType")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
    
    @NotBlank
    @Size(min = 3, max = 255)
    @Column(nullable = false, length = 255)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @NotBlank
    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType; // SERVICE, EVENT, CONFERENCE, RETREAT, CELL_GROUP
    
    @Column(length = 50)
    private String category;
    
    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;
    
    @Column(name = "end_date")
    private LocalDateTime endDate;
    
    @Size(max = 255)
    private String location;
    
    @Column(name = "organizer_id")
    private Long organizerId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", insertable = false, updatable = false)
    private Member organizer;
    
    @Column(name = "expected_attendance")
    private Integer expectedAttendance;
    
    @Column(name = "actual_attendance")
    private Integer actualAttendance;
    
    @NotBlank
    @Column(nullable = false, length = 50)
    private String status = "SCHEDULED"; // SCHEDULED, ONGOING, COMPLETED, CANCELLED
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}

