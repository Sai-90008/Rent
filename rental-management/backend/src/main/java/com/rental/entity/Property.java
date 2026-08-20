package com.rental.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "properties")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    private String city;
    private String state;
    private String zipCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyType type;

    private Integer bedrooms;
    private Integer bathrooms;
    private Double squareFeet;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal rentAmount;

    @Column(precision = 10, scale = 2)
    private BigDecimal depositAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyStatus status;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String amenities;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum PropertyType {
        APARTMENT, HOUSE, STUDIO, OFFICE, COMMERCIAL
    }

    public enum PropertyStatus {
        AVAILABLE, OCCUPIED, MAINTENANCE, INACTIVE
    }
}
