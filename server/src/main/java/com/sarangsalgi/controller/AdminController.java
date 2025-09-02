package com.sarangsalgi.controller;

import com.sarangsalgi.dto.*;
import com.sarangsalgi.entity.ConcernCategory;
import com.sarangsalgi.service.AdminService;
import com.sarangsalgi.service.ConcernService;
import com.sarangsalgi.service.TopicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "관리자 API")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    @Autowired
    private ConcernService concernService;
    
    @Autowired
    private TopicService topicService;
    
    @PostMapping("/login")
    @Operation(summary = "관리자 로그인", description = "관리자 비밀번호로 로그인합니다")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody AdminLoginRequest request, 
                                                    HttpServletResponse response) {
        if (!adminService.validatePassword(request.getPassword())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "비밀번호가 올바르지 않습니다");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
        
        String sessionId = adminService.createSession();
        
        Cookie cookie = new Cookie("ADMIN_SESSION", sessionId);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 24 hours
        response.addCookie(cookie);
        
        Map<String, String> result = new HashMap<>();
        result.put("message", "로그인 성공");
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/logout")
    @Operation(summary = "관리자 로그아웃", description = "관리자 세션을 종료합니다")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, 
                                                     HttpServletResponse response) {
        String sessionId = getSessionIdFromRequest(request);
        adminService.invalidateSession(sessionId);
        
        Cookie cookie = new Cookie("ADMIN_SESSION", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        
        Map<String, String> result = new HashMap<>();
        result.put("message", "로그아웃 성공");
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/session")
    @Operation(summary = "세션 상태 확인", description = "현재 관리자 세션 상태를 확인합니다")
    public ResponseEntity<AdminSessionResponse> getSessionInfo(HttpServletRequest request) {
        String sessionId = getSessionIdFromRequest(request);
        AdminSessionResponse sessionInfo = adminService.getSessionInfo(sessionId);
        return ResponseEntity.ok(sessionInfo);
    }
    
    @GetMapping("/concerns")
    @Operation(summary = "고민 전체 조회", description = "관리자가 모든 고민을 조회합니다 (검색/필터/정렬 지원)")
    public ResponseEntity<Map<String, Object>> getAllConcerns(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) ConcernCategory category,
            @RequestParam(required = false) String sort,
            HttpServletRequest request) {
        
        if (!isAuthenticated(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        List<ConcernResponse> concerns = concernService.getAllConcerns(q, category, sort);
        long totalCount = concernService.getConcernsCount();
        
        Map<String, Object> result = new HashMap<>();
        result.put("concerns", concerns);
        result.put("totalCount", totalCount);
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/topics")
    @Operation(summary = "토픽 생성", description = "관리자가 새 토픽을 생성합니다")
    public ResponseEntity<TopicResponse> createTopic(@Valid @RequestBody TopicRequest request,
                                                   HttpServletRequest httpRequest) {
        if (!isAuthenticated(httpRequest)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        TopicResponse response = topicService.createTopic(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PutMapping("/topics/{id}")
    @Operation(summary = "토픽 수정", description = "관리자가 토픽을 수정합니다")
    public ResponseEntity<TopicResponse> updateTopic(@PathVariable UUID id,
                                                   @Valid @RequestBody TopicRequest request,
                                                   HttpServletRequest httpRequest) {
        if (!isAuthenticated(httpRequest)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        TopicResponse response = topicService.updateTopic(id, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/topics/{id}")
    @Operation(summary = "토픽 삭제", description = "관리자가 토픽을 삭제합니다")
    public ResponseEntity<Map<String, String>> deleteTopic(@PathVariable UUID id,
                                                          HttpServletRequest request) {
        if (!isAuthenticated(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        topicService.deleteTopic(id);
        
        Map<String, String> result = new HashMap<>();
        result.put("message", "토픽이 삭제되었습니다");
        return ResponseEntity.ok(result);
    }
    
    private boolean isAuthenticated(HttpServletRequest request) {
        String sessionId = getSessionIdFromRequest(request);
        return adminService.isValidSession(sessionId);
    }
    
    private String getSessionIdFromRequest(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("ADMIN_SESSION".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}