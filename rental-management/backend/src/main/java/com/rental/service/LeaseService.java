package com.rental.service;

import com.rental.dto.LeaseDto;
import com.rental.entity.Lease;
import com.rental.entity.Property;
import com.rental.exception.ResourceNotFoundException;
import com.rental.repository.LeaseRepository;
import com.rental.repository.PropertyRepository;
import com.rental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaseService {

    @Autowired private LeaseRepository leaseRepository;
    @Autowired private PropertyRepository propertyRepository;
    @Autowired private UserRepository userRepository;

    public List<LeaseDto> getAllLeases() {
        return leaseRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public LeaseDto getLeaseById(Long id) {
        return toDto(leaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lease not found: " + id)));
    }

    @Transactional
    public LeaseDto createLease(LeaseDto dto) {
        Lease lease = new Lease();
        mapDtoToEntity(dto, lease);

        Property property = propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        property.setStatus(Property.PropertyStatus.OCCUPIED);
        propertyRepository.save(property);

        return toDto(leaseRepository.save(lease));
    }

    public LeaseDto updateLease(Long id, LeaseDto dto) {
        Lease lease = leaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lease not found: " + id));
        mapDtoToEntity(dto, lease);
        return toDto(leaseRepository.save(lease));
    }

    @Transactional
    public void terminateLease(Long id) {
        Lease lease = leaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lease not found: " + id));
        lease.setStatus(Lease.LeaseStatus.TERMINATED);
        leaseRepository.save(lease);

        Property property = lease.getProperty();
        property.setStatus(Property.PropertyStatus.AVAILABLE);
        propertyRepository.save(property);
    }

    public List<LeaseDto> getLeasesByTenant(Long tenantId) {
        return leaseRepository.findByTenantId(tenantId).stream().map(this::toDto).collect(Collectors.toList());
    }

    private void mapDtoToEntity(LeaseDto dto, Lease lease) {
        lease.setProperty(propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found")));
        lease.setTenant(userRepository.findById(dto.getTenantId())
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found")));
        lease.setStartDate(dto.getStartDate());
        lease.setEndDate(dto.getEndDate());
        lease.setMonthlyRent(dto.getMonthlyRent());
        lease.setDepositPaid(dto.getDepositPaid());
        lease.setStatus(dto.getStatus() != null ? dto.getStatus() : Lease.LeaseStatus.ACTIVE);
        lease.setTerms(dto.getTerms());
        lease.setPaymentDayOfMonth(dto.getPaymentDayOfMonth());
    }

    private LeaseDto toDto(Lease l) {
        return LeaseDto.builder()
                .id(l.getId())
                .propertyId(l.getProperty().getId())
                .propertyName(l.getProperty().getName())
                .propertyAddress(l.getProperty().getAddress())
                .tenantId(l.getTenant().getId())
                .tenantName(l.getTenant().getFullName())
                .tenantEmail(l.getTenant().getEmail())
                .startDate(l.getStartDate())
                .endDate(l.getEndDate())
                .monthlyRent(l.getMonthlyRent())
                .depositPaid(l.getDepositPaid())
                .status(l.getStatus())
                .terms(l.getTerms())
                .paymentDayOfMonth(l.getPaymentDayOfMonth())
                .createdAt(l.getCreatedAt())
                .build();
    }
}
