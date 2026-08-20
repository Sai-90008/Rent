package com.rental.service;

import com.rental.dto.DashboardDto;
import com.rental.dto.MaintenanceDto;
import com.rental.dto.PaymentDto;
import com.rental.entity.MaintenanceRequest;
import com.rental.entity.User;
import com.rental.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired private PropertyRepository propertyRepository;
    @Autowired private LeaseRepository leaseRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private MaintenanceRequestRepository maintenanceRepo;
    @Autowired private UserRepository userRepository;
    @Autowired private PaymentService paymentService;
    @Autowired private MaintenanceService maintenanceService;

    public DashboardDto getDashboard() {
        long totalProperties = propertyRepository.count();
        long available = propertyRepository.countAvailable();
        long occupied = propertyRepository.countOccupied();
        long activeLeases = leaseRepository.countActive();
        long tenants = userRepository.findByRole(User.Role.TENANT).size();
        long overdue = paymentRepository.countOverdue();
        long openMaint = maintenanceRepo.countByStatus(MaintenanceRequest.RequestStatus.OPEN);

        BigDecimal totalRevenue = paymentRepository.sumTotalRevenue();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        int month = LocalDate.now().getMonthValue();
        int year = LocalDate.now().getYear();
        BigDecimal monthlyRevenue = paymentRepository.sumCompletedByMonth(month, year);
        if (monthlyRevenue == null) monthlyRevenue = BigDecimal.ZERO;

        List<PaymentDto> recentPayments = paymentRepository.findAll(PageRequest.of(0, 5))
                .stream().map(payment -> paymentService.getPaymentById(payment.getId())).limit(5).collect(Collectors.toList());

        List<MaintenanceDto> recentMaint = maintenanceRepo.findByStatus(MaintenanceRequest.RequestStatus.OPEN)
                .stream().limit(5).map(r -> maintenanceService.getRequestById(r.getId())).collect(Collectors.toList());

        return DashboardDto.builder()
                .totalProperties(totalProperties)
                .availableProperties(available)
                .occupiedProperties(occupied)
                .activeLeases(activeLeases)
                .totalTenants(tenants)
                .overduePayments(overdue)
                .openMaintenanceRequests(openMaint)
                .totalRevenue(totalRevenue)
                .monthlyRevenue(monthlyRevenue)
                .recentPayments(recentPayments)
                .recentMaintenance(recentMaint)
                .build();
    }
}
