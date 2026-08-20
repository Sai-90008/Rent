package com.rental.service;

import com.rental.dto.PropertyDto;
import com.rental.entity.Property;
import com.rental.entity.User;
import com.rental.exception.ResourceNotFoundException;
import com.rental.repository.PropertyRepository;
import com.rental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    public List<PropertyDto> getAllProperties() {
        return propertyRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public PropertyDto getPropertyById(Long id) {
        return toDto(propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found: " + id)));
    }

    public PropertyDto createProperty(PropertyDto dto) {
        Property property = new Property();
        mapDtoToEntity(dto, property);
        if (dto.getOwnerId() != null) {
            User owner = userRepository.findById(dto.getOwnerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
            property.setOwner(owner);
        }
        return toDto(propertyRepository.save(property));
    }

    public PropertyDto updateProperty(Long id, PropertyDto dto) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found: " + id));
        mapDtoToEntity(dto, property);
        if (dto.getOwnerId() != null) {
            User owner = userRepository.findById(dto.getOwnerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
            property.setOwner(owner);
        }
        return toDto(propertyRepository.save(property));
    }

    public void deleteProperty(Long id) {
        if (!propertyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Property not found: " + id);
        }
        propertyRepository.deleteById(id);
    }

    public List<PropertyDto> getAvailableProperties() {
        return propertyRepository.findByStatus(Property.PropertyStatus.AVAILABLE)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    private void mapDtoToEntity(PropertyDto dto, Property property) {
        property.setName(dto.getName());
        property.setAddress(dto.getAddress());
        property.setCity(dto.getCity());
        property.setState(dto.getState());
        property.setZipCode(dto.getZipCode());
        property.setType(dto.getType());
        property.setBedrooms(dto.getBedrooms());
        property.setBathrooms(dto.getBathrooms());
        property.setSquareFeet(dto.getSquareFeet());
        property.setRentAmount(dto.getRentAmount());
        property.setDepositAmount(dto.getDepositAmount());
        property.setStatus(dto.getStatus() != null ? dto.getStatus() : Property.PropertyStatus.AVAILABLE);
        property.setDescription(dto.getDescription());
        property.setAmenities(dto.getAmenities());
    }

    public PropertyDto toDto(Property p) {
        return PropertyDto.builder()
                .id(p.getId())
                .name(p.getName())
                .address(p.getAddress())
                .city(p.getCity())
                .state(p.getState())
                .zipCode(p.getZipCode())
                .type(p.getType())
                .bedrooms(p.getBedrooms())
                .bathrooms(p.getBathrooms())
                .squareFeet(p.getSquareFeet())
                .rentAmount(p.getRentAmount())
                .depositAmount(p.getDepositAmount())
                .status(p.getStatus())
                .description(p.getDescription())
                .amenities(p.getAmenities())
                .ownerId(p.getOwner() != null ? p.getOwner().getId() : null)
                .ownerName(p.getOwner() != null ? p.getOwner().getFullName() : null)
                .createdAt(p.getCreatedAt())
                .build();
    }
}
