package com.sarangsalgi.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "answers")
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID topicId;

    @NotBlank(message = "학번은 필수입니다")
    @Pattern(regexp = "^\\d{8,10}$", message = "학번은 8-10자리 숫자여야 합니다")
    @Size(max = 16, message = "학번은 16자를 초과할 수 없습니다")
    @Column(nullable = false, length = 16)
    private String studentId;

    @Size(max = 20, message = "이름은 20자를 초과할 수 없습니다")
    @Column(length = 20)
    private String name;

    @NotBlank(message = "내용은 필수입니다")
    @Size(max = 2000, message = "내용은 2000자를 초과할 수 없습니다")
    @Column(nullable = false, length = 2000)
    private String content;

    @CreationTimestamp
    @Column(nullable = false)
    private Instant createdAt;

    // Constructors
    public Answer() {}

    public Answer(UUID topicId, String studentId, String name, String content) {
        this.topicId = topicId;
        this.studentId = studentId;
        this.name = name;
        this.content = content;
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