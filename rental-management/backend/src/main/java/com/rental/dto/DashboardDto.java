package com.rental.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDto {
    private long totalProperties;
    private long availableProperties;
    private long occupiedProperties;
    private long activeLeases;
    private long totalTenants;
    private long overduePayments;
    private long openMaintenanceRequests;
    private BigDecimal totalRevenue;
    private BigDecimal monthlyRevenue;
    private List<PaymentDto> recentPayments;
    private List<MaintenanceDto> recentMaintenance;
}
