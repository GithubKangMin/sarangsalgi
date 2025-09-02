package com.sarangsalgi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AnswerRequest {
    @NotBlank(message = "학번은 필수입니다")
    @Pattern(regexp = "^\\d{8,10}$", message = "학번은 8-10자리 숫자여야 합니다")
    @Size(max = 16, message = "학번은 16자를 초과할 수 없습니다")
    private String studentId;

    @Size(max = 20, message = "이름은 20자를 초과할 수 없습니다")
    private String name;

    @NotBlank(message = "내용은 필수입니다")
    @Size(max = 2000, message = "내용은 2000자를 초과할 수 없습니다")
    private String content;

    // Constructors
    public AnswerRequest() {}

    public AnswerRequest(String studentId, String name, String content) {
        this.studentId = studentId;
        this.name = name;
        this.content = content;
    }

    // Getters and Setters
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}