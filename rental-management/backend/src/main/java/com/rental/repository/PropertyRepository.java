package com.rental.repository;

import com.rental.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByStatus(Property.PropertyStatus status);
    List<Property> findByOwnerId(Long ownerId);
    List<Property> findByType(Property.PropertyType type);

    @Query("SELECT COUNT(p) FROM Property p WHERE p.status = 'AVAILABLE'")
    long countAvailable();

    @Query("SELECT COUNT(p) FROM Property p WHERE p.status = 'OCCUPIED'")
    long countOccupied();
}
