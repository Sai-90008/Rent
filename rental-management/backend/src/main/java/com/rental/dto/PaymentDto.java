package com.rental.dto;

import com.rental.entity.Payment;
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
public class PaymentDto {
    private Long id;
    private Long leaseId;
    private Long tenantId;
    private String tenantName;
    private String propertyName;
    private BigDecimal amount;
    private LocalDate paymentDate;
    private LocalDate dueDate;
    private Payment.PaymentStatus status;
    private Payment.PaymentMethod method;
    private String transactionId;
    private String notes;
    private BigDecimal lateFee;
    private LocalDateTime createdAt;
}
