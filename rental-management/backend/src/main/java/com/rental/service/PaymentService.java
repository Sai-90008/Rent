package com.rental.service;

import com.rental.dto.PaymentDto;
import com.rental.entity.Payment;
import com.rental.exception.ResourceNotFoundException;
import com.rental.repository.LeaseRepository;
import com.rental.repository.PaymentRepository;
import com.rental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    @Autowired private PaymentRepository paymentRepository;
    @Autowired private LeaseRepository leaseRepository;
    @Autowired private UserRepository userRepository;

    public List<PaymentDto> getAllPayments() {
        return paymentRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public PaymentDto getPaymentById(Long id) {
        return toDto(paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + id)));
    }

    public PaymentDto createPayment(PaymentDto dto) {
        Payment payment = new Payment();
        mapDtoToEntity(dto, payment);
        return toDto(paymentRepository.save(payment));
    }

    public PaymentDto updatePayment(Long id, PaymentDto dto) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + id));
        mapDtoToEntity(dto, payment);
        return toDto(paymentRepository.save(payment));
    }

    public void deletePayment(Long id) {
        if (!paymentRepository.existsById(id))
            throw new ResourceNotFoundException("Payment not found: " + id);
        paymentRepository.deleteById(id);
    }

    public List<PaymentDto> getPaymentsByTenant(Long tenantId) {
        return paymentRepository.findByTenantId(tenantId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<PaymentDto> getOverduePayments() {
        return paymentRepository.findOverduePayments(LocalDate.now()).stream().map(this::toDto).collect(Collectors.toList());
    }

    private void mapDtoToEntity(PaymentDto dto, Payment payment) {
        payment.setLease(leaseRepository.findById(dto.getLeaseId())
                .orElseThrow(() -> new ResourceNotFoundException("Lease not found")));
        payment.setTenant(userRepository.findById(dto.getTenantId())
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found")));
        payment.setAmount(dto.getAmount());
        payment.setPaymentDate(dto.getPaymentDate() != null ? dto.getPaymentDate() : LocalDate.now());
        payment.setDueDate(dto.getDueDate());
        payment.setStatus(dto.getStatus() != null ? dto.getStatus() : Payment.PaymentStatus.COMPLETED);
        payment.setMethod(dto.getMethod());
        payment.setTransactionId(dto.getTransactionId());
        payment.setNotes(dto.getNotes());
        payment.setLateFee(dto.getLateFee());
    }

    private PaymentDto toDto(Payment p) {
        return PaymentDto.builder()
                .id(p.getId())
                .leaseId(p.getLease().getId())
                .tenantId(p.getTenant().getId())
                .tenantName(p.getTenant().getFullName())
                .propertyName(p.getLease().getProperty().getName())
                .amount(p.getAmount())
                .paymentDate(p.getPaymentDate())
                .dueDate(p.getDueDate())
                .status(p.getStatus())
                .method(p.getMethod())
                .transactionId(p.getTransactionId())
                .notes(p.getNotes())
                .lateFee(p.getLateFee())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
