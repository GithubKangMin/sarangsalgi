package com.sarangsalgi.mapper;

import com.sarangsalgi.dto.ConcernRequest;
import com.sarangsalgi.dto.ConcernResponse;
import com.sarangsalgi.entity.Concern;
import org.springframework.stereotype.Component;

@Component
public class ConcernMapper {
    
    public Concern toEntity(ConcernRequest request) {
        return new Concern(
            request.getStudentId() != null ? request.getStudentId().trim() : null,
            request.getName() != null ? request.getName().trim() : null,
            request.getCategory(),
            request.getTitle() != null ? request.getTitle().trim() : null,
            request.getContent() != null ? request.getContent().trim() : null
        );
    }
    
    public ConcernResponse toResponse(Concern concern) {
        return new ConcernResponse(
            concern.getId(),
            concern.getStudentId(),
            concern.getName(),
            concern.getCategory(),
            concern.getTitle(),
            concern.getContent(),
            concern.getCreatedAt()
        );
    }
}