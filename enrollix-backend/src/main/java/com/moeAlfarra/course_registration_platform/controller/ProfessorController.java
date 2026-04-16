package com.moeAlfarra.course_registration_platform.controller;

import com.moeAlfarra.course_registration_platform.dto.*;
import com.moeAlfarra.course_registration_platform.service.ProfessorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// PROFESSOR Endpoints
@RestController
@RequestMapping("/api/professors")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorService professorService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<UserResponse> getUser(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(professorService.getUser(email));
    }

    @GetMapping("/courses")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<List<CourseResponse>> getCourses() {
        return ResponseEntity.ok(professorService.getCourses());
    }

    @PostMapping("/offerings")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<CourseOfferingResponse> createOffering(
            @RequestBody CourseOfferingRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(professorService.createCourseOffering(request, email));
    }

    @GetMapping("/offerings")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<List<CourseOfferingResponse>> getMyOfferings(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(professorService.getMyOfferings(email));
    }

    @GetMapping("/offerings/{offeringId}/students")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<List<ProfessorStudentResponse>> getStudentsForOffering(
            @PathVariable Integer offeringId,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(professorService.getStudentsForOffering(offeringId, email));
    }

    @DeleteMapping("/offerings/{offeringId}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<String> deleteOffering(
            @PathVariable Integer offeringId,
            Authentication authentication) {
        String email = authentication.getName();
        professorService.deleteOffering(offeringId, email);
        return ResponseEntity.ok("Course Offering was deleted successfully");
    }

    @PutMapping("/offerings/{offeringId}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<String> updateOffering(
            @PathVariable Integer offeringId,
            @RequestBody UpdateCourseOfferingRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        professorService.updateOffering(offeringId, request, email);
        return ResponseEntity.ok("Course Offering was updated successfully");
    }
}
