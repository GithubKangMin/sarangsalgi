package com.sarangsalgi.repository;

import com.sarangsalgi.entity.Concern;
import com.sarangsalgi.entity.ConcernCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ConcernRepository extends JpaRepository<Concern, UUID> {
    
    @Query("SELECT c FROM Concern c WHERE " +
           "(:q IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(c.content) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "c.studentId LIKE CONCAT('%', :q, '%')) AND " +
           "(:category IS NULL OR c.category = :category) " +
           "ORDER BY " +
           "CASE WHEN :sort = 'oldest' THEN c.createdAt END ASC, " +
           "CASE WHEN :sort = 'latest' OR :sort IS NULL THEN c.createdAt END DESC")
    List<Concern> findWithFilters(@Param("q") String searchQuery, 
                                 @Param("category") ConcernCategory category,
                                 @Param("sort") String sort);
    
    long count();
}