package com.sarangsalgi.mapper;

import com.sarangsalgi.dto.AnswerRequest;
import com.sarangsalgi.dto.AnswerResponse;
import com.sarangsalgi.entity.Answer;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class AnswerMapper {
    
    public Answer toEntity(AnswerRequest request, UUID topicId) {
        return new Answer(
            topicId,
            request.getStudentId() != null ? request.getStudentId().trim() : null,
            request.getName() != null ? request.getName().trim() : null,
            request.getContent() != null ? request.getContent().trim() : null
        );
    }
    
    public AnswerResponse toResponse(Answer answer) {
        return new AnswerResponse(
            answer.getId(),
            answer.getTopicId(),
            answer.getStudentId(),
            answer.getName(),
            answer.getContent(),
            answer.getCreatedAt()
        );
    }
}