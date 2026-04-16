package com.moeAlfarra.course_registration_platform.controller;

import com.moeAlfarra.course_registration_platform.dto.AuthResponse;
import com.moeAlfarra.course_registration_platform.dto.LoginRequest;
import com.moeAlfarra.course_registration_platform.dto.CreateUserRequest;
import com.moeAlfarra.course_registration_platform.dto.StudentRegisterRequest;
import com.moeAlfarra.course_registration_platform.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// AUTHENTICATION Endpoints
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody StudentRegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
