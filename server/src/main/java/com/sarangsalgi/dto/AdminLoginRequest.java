package com.sarangsalgi.dto;

import jakarta.validation.constraints.NotBlank;

public class AdminLoginRequest {
    @NotBlank(message = "비밀번호는 필수입니다")
    private String password;

    // Constructors
    public AdminLoginRequest() {}

    public AdminLoginRequest(String password) {
        this.password = password;
    }

    // Getters and Setters
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}