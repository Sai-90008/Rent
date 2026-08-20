package com.rental.service;

import com.rental.dto.MaintenanceDto;
import com.rental.entity.MaintenanceRequest;
import com.rental.exception.ResourceNotFoundException;
import com.rental.repository.MaintenanceRequestRepository;
import com.rental.repository.PropertyRepository;
import com.rental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaintenanceService {

    @Autowired private MaintenanceRequestRepository maintenanceRepo;
    @Autowired private PropertyRepository propertyRepository;
    @Autowired private UserRepository userRepository;

    public List<MaintenanceDto> getAllRequests() {
        return maintenanceRepo.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public MaintenanceDto getRequestById(Long id) {
        return toDto(maintenanceRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance request not found: " + id)));
    }

    public MaintenanceDto createRequest(MaintenanceDto dto) {
        MaintenanceRequest req = new MaintenanceRequest();
        mapDtoToEntity(dto, req);
        return toDto(maintenanceRepo.save(req));
    }

    public MaintenanceDto updateRequest(Long id, MaintenanceDto dto) {
        MaintenanceRequest req = maintenanceRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance request not found: " + id));
        mapDtoToEntity(dto, req);
        if (dto.getStatus() == MaintenanceRequest.RequestStatus.RESOLVED && req.getResolvedAt() == null) {
            req.setResolvedAt(LocalDateTime.now());
        }
        return toDto(maintenanceRepo.save(req));
    }

    public void deleteRequest(Long id) {
        if (!maintenanceRepo.existsById(id))
            throw new ResourceNotFoundException("Request not found: " + id);
        maintenanceRepo.deleteById(id);
    }

    public List<MaintenanceDto> getRequestsByTenant(Long tenantId) {
        return maintenanceRepo.findByTenantId(tenantId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<MaintenanceDto> getRequestsByProperty(Long propertyId) {
        return maintenanceRepo.findByPropertyId(propertyId).stream().map(this::toDto).collect(Collectors.toList());
    }

    private void mapDtoToEntity(MaintenanceDto dto, MaintenanceRequest req) {
        req.setProperty(propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found")));
        req.setTenant(userRepository.findById(dto.getTenantId())
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found")));
        if (dto.getAssignedToId() != null) {
            req.setAssignedTo(userRepository.findById(dto.getAssignedToId()).orElse(null));
        }
        req.setTitle(dto.getTitle());
        req.setDescription(dto.getDescription());
        req.setPriority(dto.getPriority() != null ? dto.getPriority() : MaintenanceRequest.Priority.MEDIUM);
        req.setStatus(dto.getStatus() != null ? dto.getStatus() : MaintenanceRequest.RequestStatus.OPEN);
        req.setResolutionNotes(dto.getResolutionNotes());
    }

    private MaintenanceDto toDto(MaintenanceRequest r) {
        return MaintenanceDto.builder()
                .id(r.getId())
                .propertyId(r.getProperty().getId())
                .propertyName(r.getProperty().getName())
                .tenantId(r.getTenant().getId())
                .tenantName(r.getTenant().getFullName())
                .assignedToId(r.getAssignedTo() != null ? r.getAssignedTo().getId() : null)
                .assignedToName(r.getAssignedTo() != null ? r.getAssignedTo().getFullName() : null)
                .title(r.getTitle())
                .description(r.getDescription())
                .priority(r.getPriority())
                .status(r.getStatus())
                .resolutionNotes(r.getResolutionNotes())
                .resolvedAt(r.getResolvedAt())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build();
    }
}
