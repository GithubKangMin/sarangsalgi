package com.sarangsalgi.service;

import com.sarangsalgi.dto.TopicRequest;
import com.sarangsalgi.dto.TopicResponse;
import com.sarangsalgi.entity.Topic;
import com.sarangsalgi.exception.ResourceNotFoundException;
import com.sarangsalgi.mapper.TopicMapper;
import com.sarangsalgi.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class TopicService {
    
    @Autowired
    private TopicRepository topicRepository;
    
    @Autowired
    private TopicMapper topicMapper;
    
    @Transactional(readOnly = true)
    public List<TopicResponse> getAllTopics() {
        List<Topic> topics = topicRepository.findAllByOrderByCreatedAtDesc();
        return topics.stream()
                .map(topic -> {
                    Long answersCount = topicRepository.countAnswersByTopicId(topic.getId());
                    Instant lastUpdatedAt = topicRepository.findLastUpdatedAt(topic.getId());
                    return topicMapper.toResponse(topic, answersCount, lastUpdatedAt);
                })
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public TopicResponse getTopicById(UUID id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("토픽을 찾을 수 없습니다"));
        
        Long answersCount = topicRepository.countAnswersByTopicId(id);
        Instant lastUpdatedAt = topicRepository.findLastUpdatedAt(id);
        return topicMapper.toResponse(topic, answersCount, lastUpdatedAt);
    }
    
    public TopicResponse createTopic(TopicRequest request) {
        validateInput(request);
        Topic topic = topicMapper.toEntity(request);
        Topic saved = topicRepository.save(topic);
        
        Long answersCount = 0L;
        return topicMapper.toResponse(saved, answersCount, saved.getUpdatedAt());
    }
    
    public TopicResponse updateTopic(UUID id, TopicRequest request) {
        validateInput(request);
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("토픽을 찾을 수 없습니다"));
        
        topic.setTitle(request.getTitle().trim());
        topic.setContent(request.getContent().trim());
        Topic saved = topicRepository.save(topic);
        
        Long answersCount = topicRepository.countAnswersByTopicId(id);
        Instant lastUpdatedAt = topicRepository.findLastUpdatedAt(id);
        return topicMapper.toResponse(saved, answersCount, lastUpdatedAt);
    }
    
    public void deleteTopic(UUID id) {
        if (!topicRepository.existsById(id)) {
            throw new ResourceNotFoundException("토픽을 찾을 수 없습니다");
        }
        topicRepository.deleteById(id);
    }
    
    private void validateInput(TopicRequest request) {
        if (request.getTitle() != null && request.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("제목은 공백일 수 없습니다");
        }
        if (request.getContent() != null && request.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("내용은 공백일 수 없습니다");
        }
    }
}