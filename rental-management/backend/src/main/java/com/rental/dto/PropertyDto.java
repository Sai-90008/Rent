package com.rental.dto;

import com.rental.entity.Property;
import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyDto {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private Property.PropertyType type;
    private Integer bedrooms;
    private Integer bathrooms;
    private Double squareFeet;
    private BigDecimal rentAmount;
    private BigDecimal depositAmount;
    private Property.PropertyStatus status;
    private String description;
    private String amenities;
    private Long ownerId;
    private String ownerName;
    private LocalDateTime createdAt;
}
