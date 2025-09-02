package com.sarangsalgi.dto;

import com.sarangsalgi.entity.ConcernCategory;

import java.time.Instant;
import java.util.UUID;

public class ConcernResponse {
    private UUID id;
    private String studentId;
    private String name;
    private ConcernCategory category;
    private String title;
    private String content;
    private Instant createdAt;

    // Constructors
    public ConcernResponse() {}

    public ConcernResponse(UUID id, String studentId, String name, ConcernCategory category, 
                          String title, String content, Instant createdAt) {
        this.id = id;
        this.studentId = studentId;
        this.name = name;
        this.category = category;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public ConcernCategory getCategory() { return category; }
    public void setCategory(ConcernCategory category) { this.category = category; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}