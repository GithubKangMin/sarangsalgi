package com.sarangsalgi.dto;

import java.time.Instant;
import java.util.UUID;

public class TopicResponse {
    private UUID id;
    private String title;
    private String content;
    private Instant createdAt;
    private Long answersCount;
    private Instant lastUpdatedAt;

    // Constructors
    public TopicResponse() {}

    public TopicResponse(UUID id, String title, String content, Instant createdAt, 
                        Long answersCount, Instant lastUpdatedAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.answersCount = answersCount;
        this.lastUpdatedAt = lastUpdatedAt;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Long getAnswersCount() { return answersCount; }
    public void setAnswersCount(Long answersCount) { this.answersCount = answersCount; }

    public Instant getLastUpdatedAt() { return lastUpdatedAt; }
    public void setLastUpdatedAt(Instant lastUpdatedAt) { this.lastUpdatedAt = lastUpdatedAt; }
}