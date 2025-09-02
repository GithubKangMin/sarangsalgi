package com.sarangsalgi.dto;

import java.time.Instant;

public class AdminSessionResponse {
    private boolean loggedIn;
    private Instant expiresAt;

    // Constructors
    public AdminSessionResponse() {}

    public AdminSessionResponse(boolean loggedIn, Instant expiresAt) {
        this.loggedIn = loggedIn;
        this.expiresAt = expiresAt;
    }

    // Getters and Setters
    public boolean isLoggedIn() { return loggedIn; }
    public void setLoggedIn(boolean loggedIn) { this.loggedIn = loggedIn; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
}