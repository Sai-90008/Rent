package com.rental.controller;

import com.rental.dto.LeaseDto;
import com.rental.service.LeaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leases")
@CrossOrigin(origins = "http://localhost:3000")
public class LeaseController {

    @Autowired private LeaseService leaseService;

    @GetMapping
    public ResponseEntity<List<LeaseDto>> getAll() {
        return ResponseEntity.ok(leaseService.getAllLeases());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(leaseService.getLeaseById(id));
    }

    @PostMapping
    public ResponseEntity<LeaseDto> create(@RequestBody LeaseDto dto) {
        return ResponseEntity.ok(leaseService.createLease(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeaseDto> update(@PathVariable Long id, @RequestBody LeaseDto dto) {
        return ResponseEntity.ok(leaseService.updateLease(id, dto));
    }

    @PatchMapping("/{id}/terminate")
    public ResponseEntity<Void> terminate(@PathVariable Long id) {
        leaseService.terminateLease(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<LeaseDto>> getByTenant(@PathVariable Long tenantId) {
        return ResponseEntity.ok(leaseService.getLeasesByTenant(tenantId));
    }
}
