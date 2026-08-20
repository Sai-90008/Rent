package com.rental.controller;

import com.rental.dto.MaintenanceDto;
import com.rental.service.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "http://localhost:3000")
public class MaintenanceController {

    @Autowired private MaintenanceService maintenanceService;

    @GetMapping
    public ResponseEntity<List<MaintenanceDto>> getAll() {
        return ResponseEntity.ok(maintenanceService.getAllRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.getRequestById(id));
    }

    @PostMapping
    public ResponseEntity<MaintenanceDto> create(@RequestBody MaintenanceDto dto) {
        return ResponseEntity.ok(maintenanceService.createRequest(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceDto> update(@PathVariable Long id, @RequestBody MaintenanceDto dto) {
        return ResponseEntity.ok(maintenanceService.updateRequest(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        maintenanceService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<MaintenanceDto>> getByProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(maintenanceService.getRequestsByProperty(propertyId));
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<MaintenanceDto>> getByTenant(@PathVariable Long tenantId) {
        return ResponseEntity.ok(maintenanceService.getRequestsByTenant(tenantId));
    }
}
