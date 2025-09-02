package com.sarangsalgi.dto;

import java.time.Instant;
import java.util.UUID;

public class AnswerResponse {
    private UUID id;
    private UUID topicId;
    private String studentId;
    private String name;
    private String content;
    private Instant createdAt;

    // Constructors
    public AnswerResponse() {}

    public AnswerResponse(UUID id, UUID topicId, String studentId, String name, 
                         String content, Instant createdAt) {
        this.id = id;
        this.topicId = topicId;
        this.studentId = studentId;
        this.name = name;
        this.content = content;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTopicId() { return topicId; }
    public void setTopicId(UUID topicId) { this.topicId = topicId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}