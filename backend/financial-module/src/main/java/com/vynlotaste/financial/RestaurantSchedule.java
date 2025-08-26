package com.vynlotaste.financial;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalTime;

@Entity
@Table(name = "restaurant_schedules")
@Data
public class RestaurantSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String dayOfWeek;
    private LocalTime openTime;
    private LocalTime closeTime;
}