package com.sarangsalgi.service;

import com.sarangsalgi.dto.ConcernRequest;
import com.sarangsalgi.dto.ConcernResponse;
import com.sarangsalgi.entity.Concern;
import com.sarangsalgi.entity.ConcernCategory;
import com.sarangsalgi.mapper.ConcernMapper;
import com.sarangsalgi.repository.ConcernRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ConcernService {
    
    @Autowired
    private ConcernRepository concernRepository;
    
    @Autowired
    private ConcernMapper concernMapper;
    
    public ConcernResponse createConcern(ConcernRequest request) {
        validateInput(request);
        Concern concern = concernMapper.toEntity(request);
        Concern saved = concernRepository.save(concern);
        return concernMapper.toResponse(saved);
    }
    
    @Transactional(readOnly = true)
    public List<ConcernResponse> getAllConcerns(String searchQuery, ConcernCategory category, String sort) {
        List<Concern> concerns = concernRepository.findWithFilters(searchQuery, category, sort);
        return concerns.stream()
                .map(concernMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public long getConcernsCount() {
        return concernRepository.count();
    }
    
    private void validateInput(ConcernRequest request) {
        if (request.getStudentId() != null && request.getStudentId().trim().isEmpty()) {
            throw new IllegalArgumentException("학번은 공백일 수 없습니다");
        }
        if (request.getName() != null && request.getName().trim().isEmpty()) {
            request.setName(null);
        }
        if (request.getTitle() != null && request.getTitle().trim().isEmpty()) {
            request.setTitle(null);
        }
        if (request.getContent() != null && request.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("내용은 공백일 수 없습니다");
        }
    }
}