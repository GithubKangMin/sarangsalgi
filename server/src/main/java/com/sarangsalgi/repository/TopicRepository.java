package com.sarangsalgi.repository;

import com.sarangsalgi.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface TopicRepository extends JpaRepository<Topic, UUID> {
    
    List<Topic> findAllByOrderByCreatedAtDesc();
    
    @Query("SELECT COUNT(a) FROM Answer a WHERE a.topicId = :topicId")
    Long countAnswersByTopicId(@Param("topicId") UUID topicId);
    
    @Query("SELECT COALESCE(MAX(a.createdAt), t.updatedAt) FROM Topic t " +
           "LEFT JOIN Answer a ON a.topicId = t.id WHERE t.id = :topicId")
    Instant findLastUpdatedAt(@Param("topicId") UUID topicId);
}