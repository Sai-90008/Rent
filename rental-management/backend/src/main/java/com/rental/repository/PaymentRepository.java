package com.rental.repository;

import com.rental.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByTenantId(Long tenantId);
    List<Payment> findByLeaseId(Long leaseId);
    List<Payment> findByStatus(Payment.PaymentStatus status);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND MONTH(p.paymentDate) = :month AND YEAR(p.paymentDate) = :year")
    BigDecimal sumCompletedByMonth(int month, int year);

    @Query("SELECT p FROM Payment p WHERE p.dueDate < :today AND p.status = 'PENDING'")
    List<Payment> findOverduePayments(LocalDate today);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 'OVERDUE'")
    long countOverdue();

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED'")
    BigDecimal sumTotalRevenue();
}
