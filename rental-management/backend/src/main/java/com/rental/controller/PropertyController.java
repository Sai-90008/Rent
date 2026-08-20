package com.rental.controller;

import com.rental.dto.PropertyDto;
import com.rental.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "http://localhost:3000")
public class PropertyController {

    @Autowired private PropertyService propertyService;

    @GetMapping
    public ResponseEntity<List<PropertyDto>> getAll() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    @PostMapping
    public ResponseEntity<PropertyDto> create(@RequestBody PropertyDto dto) {
        return ResponseEntity.ok(propertyService.createProperty(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyDto> update(@PathVariable Long id, @RequestBody PropertyDto dto) {
        return ResponseEntity.ok(propertyService.updateProperty(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/available")
    public ResponseEntity<List<PropertyDto>> getAvailable() {
        return ResponseEntity.ok(propertyService.getAvailableProperties());
    }
}
