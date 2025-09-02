package com.sarangsalgi.service;

import com.sarangsalgi.dto.AnswerRequest;
import com.sarangsalgi.dto.AnswerResponse;
import com.sarangsalgi.entity.Answer;
import com.sarangsalgi.exception.ResourceNotFoundException;
import com.sarangsalgi.mapper.AnswerMapper;
import com.sarangsalgi.repository.AnswerRepository;
import com.sarangsalgi.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class AnswerService {
    
    @Autowired
    private AnswerRepository answerRepository;
    
    @Autowired
    private TopicRepository topicRepository;
    
    @Autowired
    private AnswerMapper answerMapper;
    
    @Transactional(readOnly = true)
    public List<AnswerResponse> getAnswersByTopicId(UUID topicId) {
        if (!topicRepository.existsById(topicId)) {
            throw new ResourceNotFoundException("토픽을 찾을 수 없습니다");
        }
        
        List<Answer> answers = answerRepository.findByTopicIdOrderByCreatedAtDesc(topicId);
        return answers.stream()
                .map(answerMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public AnswerResponse createAnswer(UUID topicId, AnswerRequest request) {
        if (!topicRepository.existsById(topicId)) {
            throw new ResourceNotFoundException("토픽을 찾을 수 없습니다");
        }
        
        validateInput(request);
        Answer answer = answerMapper.toEntity(request, topicId);
        Answer saved = answerRepository.save(answer);
        return answerMapper.toResponse(saved);
    }
    
    private void validateInput(AnswerRequest request) {
        if (request.getStudentId() != null && request.getStudentId().trim().isEmpty()) {
            throw new IllegalArgumentException("학번은 공백일 수 없습니다");
        }
        if (request.getName() != null && request.getName().trim().isEmpty()) {
            request.setName(null);
        }
        if (request.getContent() != null && request.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("내용은 공백일 수 없습니다");
        }
    }
}