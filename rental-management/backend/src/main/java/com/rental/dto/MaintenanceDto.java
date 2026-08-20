package com.rental.dto;

import com.rental.entity.MaintenanceRequest;
import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceDto {
    private Long id;
    private Long propertyId;
    private String propertyName;
    private Long tenantId;
    private String tenantName;
    private Long assignedToId;
    private String assignedToName;
    private String title;
    private String description;
    private MaintenanceRequest.Priority priority;
    private MaintenanceRequest.RequestStatus status;
    private String resolutionNotes;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
