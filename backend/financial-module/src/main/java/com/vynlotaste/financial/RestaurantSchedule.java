package com.vynlotaste.financial;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "restaurant_schedules", 
       indexes = {
           @Index(name = "idx_schedule_restaurant", columnList = "restaurant_id"),
           @Index(name = "idx_schedule_day", columnList = "day_of_week")
       })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class RestaurantSchedule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Dia da semana é obrigatório")
    @Column(name = "day_of_week", nullable = false)
    private String dayOfWeek;
    
    @Column(name = "open_time")
    private LocalTime openTime;
    
    @Column(name = "close_time")
    private LocalTime closeTime;
    
    @Column(name = "is_closed")
    private Boolean isClosed;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Relacionamento com Restaurant
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;
}