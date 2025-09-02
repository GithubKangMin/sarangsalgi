package com.sarangsalgi.controller;

import com.sarangsalgi.dto.ConcernRequest;
import com.sarangsalgi.dto.ConcernResponse;
import com.sarangsalgi.service.ConcernService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/concerns")
@Tag(name = "Concerns", description = "고민 등록 API")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class ConcernController {
    
    @Autowired
    private ConcernService concernService;
    
    @PostMapping
    @Operation(summary = "고민 등록", description = "학생이 고민을 등록합니다")
    public ResponseEntity<ConcernResponse> createConcern(@Valid @RequestBody ConcernRequest request) {
        ConcernResponse response = concernService.createConcern(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}