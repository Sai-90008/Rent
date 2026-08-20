package com.rental.repository;

import com.rental.entity.Lease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LeaseRepository extends JpaRepository<Lease, Long> {
    List<Lease> findByTenantId(Long tenantId);
    List<Lease> findByPropertyId(Long propertyId);
    List<Lease> findByStatus(Lease.LeaseStatus status);
    Optional<Lease> findByPropertyIdAndStatus(Long propertyId, Lease.LeaseStatus status);

    @Query("SELECT l FROM Lease l WHERE l.endDate <= :date AND l.status = 'ACTIVE'")
    List<Lease> findExpiringLeases(LocalDate date);

    @Query("SELECT COUNT(l) FROM Lease l WHERE l.status = 'ACTIVE'")
    long countActive();
}
