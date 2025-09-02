package com.sarangsalgi.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "concerns")
public class Concern {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "학번은 필수입니다")
    @Pattern(regexp = "^\\d{8,10}$", message = "학번은 8-10자리 숫자여야 합니다")
    @Size(max = 16, message = "학번은 16자를 초과할 수 없습니다")
    @Column(nullable = false, length = 16)
    private String studentId;

    @Size(max = 20, message = "이름은 20자를 초과할 수 없습니다")
    @Column(length = 20)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConcernCategory category;

    @Size(max = 100, message = "제목은 100자를 초과할 수 없습니다")
    @Column(length = 100)
    private String title;

    @NotBlank(message = "내용은 필수입니다")
    @Size(max = 2000, message = "내용은 2000자를 초과할 수 없습니다")
    @Column(nullable = false, length = 2000)
    private String content;

    @CreationTimestamp
    @Column(nullable = false)
    private Instant createdAt;

    // Constructors
    public Concern() {}

    public Concern(String studentId, String name, ConcernCategory category, String title, String content) {
        this.studentId = studentId;
        this.name = name;
        this.category = category;
        this.title = title;
        this.content = content;
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