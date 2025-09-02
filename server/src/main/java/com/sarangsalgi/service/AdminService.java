package com.sarangsalgi.service;

import com.sarangsalgi.dto.AdminSessionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AdminService {
    
    @Value("${sarangsalgi.admin.password}")
    private String adminPassword;
    
    private final Map<String, Instant> activeSessions = new ConcurrentHashMap<>();
    private static final long SESSION_DURATION_HOURS = 24;
    
    public boolean validatePassword(String password) {
        return adminPassword.equals(password);
    }
    
    public String createSession() {
        String sessionId = java.util.UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plus(SESSION_DURATION_HOURS, ChronoUnit.HOURS);
        activeSessions.put(sessionId, expiresAt);
        return sessionId;
    }
    
    public boolean isValidSession(String sessionId) {
        if (sessionId == null) return false;
        
        Instant expiresAt = activeSessions.get(sessionId);
        if (expiresAt == null) return false;
        
        if (Instant.now().isAfter(expiresAt)) {
            activeSessions.remove(sessionId);
            return false;
        }
        
        return true;
    }
    
    public AdminSessionResponse getSessionInfo(String sessionId) {
        if (!isValidSession(sessionId)) {
            return new AdminSessionResponse(false, null);
        }
        
        Instant expiresAt = activeSessions.get(sessionId);
        return new AdminSessionResponse(true, expiresAt);
    }
    
    public void invalidateSession(String sessionId) {
        if (sessionId != null) {
            activeSessions.remove(sessionId);
        }
    }
    
    public void cleanupExpiredSessions() {
        Instant now = Instant.now();
        activeSessions.entrySet().removeIf(entry -> now.isAfter(entry.getValue()));
    }
}