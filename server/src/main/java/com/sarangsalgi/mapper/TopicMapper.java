package com.sarangsalgi.mapper;

import com.sarangsalgi.dto.TopicRequest;
import com.sarangsalgi.dto.TopicResponse;
import com.sarangsalgi.entity.Topic;
import org.springframework.stereotype.Component;

@Component
public class TopicMapper {
    
    public Topic toEntity(TopicRequest request) {
        return new Topic(
            request.getTitle() != null ? request.getTitle().trim() : null,
            request.getContent() != null ? request.getContent().trim() : null
        );
    }
    
    public TopicResponse toResponse(Topic topic, Long answersCount, java.time.Instant lastUpdatedAt) {
        return new TopicResponse(
            topic.getId(),
            topic.getTitle(),
            topic.getContent(),
            topic.getCreatedAt(),
            answersCount,
            lastUpdatedAt
        );
    }
}