package com.sarangsalgi.controller;

import com.sarangsalgi.dto.AnswerRequest;
import com.sarangsalgi.dto.AnswerResponse;
import com.sarangsalgi.dto.TopicResponse;
import com.sarangsalgi.service.AnswerService;
import com.sarangsalgi.service.TopicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/topics")
@Tag(name = "Topics", description = "토픽 조회 및 답변 API")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class TopicController {
    
    @Autowired
    private TopicService topicService;
    
    @Autowired
    private AnswerService answerService;
    
    @GetMapping
    @Operation(summary = "토픽 목록 조회", description = "모든 토픽을 최신순으로 조회합니다")
    public ResponseEntity<List<TopicResponse>> getAllTopics() {
        List<TopicResponse> topics = topicService.getAllTopics();
        return ResponseEntity.ok(topics);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "토픽 상세 조회", description = "특정 토픽의 상세 정보를 조회합니다")
    public ResponseEntity<TopicResponse> getTopicById(@PathVariable UUID id) {
        TopicResponse topic = topicService.getTopicById(id);
        return ResponseEntity.ok(topic);
    }
    
    @GetMapping("/{id}/answers")
    @Operation(summary = "토픽 답변 목록 조회", description = "특정 토픽의 모든 답변을 최신순으로 조회합니다")
    public ResponseEntity<List<AnswerResponse>> getAnswersByTopicId(@PathVariable UUID id) {
        List<AnswerResponse> answers = answerService.getAnswersByTopicId(id);
        return ResponseEntity.ok(answers);
    }
    
    @PostMapping("/{id}/answers")
    @Operation(summary = "답변 작성", description = "특정 토픽에 답변을 작성합니다")
    public ResponseEntity<AnswerResponse> createAnswer(@PathVariable UUID id, 
                                                      @Valid @RequestBody AnswerRequest request) {
        AnswerResponse response = answerService.createAnswer(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}