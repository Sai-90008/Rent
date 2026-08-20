package com.rental.dto;

import com.rental.entity.Lease;
import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaseDto {
    private Long id;
    private Long propertyId;
    private String propertyName;
    private String propertyAddress;
    private Long tenantId;
    private String tenantName;
    private String tenantEmail;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal monthlyRent;
    private BigDecimal depositPaid;
    private Lease.LeaseStatus status;
    private String terms;
    private Integer paymentDayOfMonth;
    private LocalDateTime createdAt;
}
