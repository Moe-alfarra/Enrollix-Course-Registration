package com.moeAlfarra.course_registration_platform.controller;

import com.moeAlfarra.course_registration_platform.dto.CourseOfferingResponse;
import com.moeAlfarra.course_registration_platform.dto.CourseResponse;
import com.moeAlfarra.course_registration_platform.dto.EnrollmentResponse;
import com.moeAlfarra.course_registration_platform.dto.UserResponse;
import com.moeAlfarra.course_registration_platform.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// STUDENT Endpoints
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor

public class StudentController {

    private final StudentService studentService;


    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<UserResponse> getUser(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(studentService.getUser(email));
    }
    @GetMapping("/courses")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CourseResponse>> getCourses() {
        return ResponseEntity.ok(studentService.getCourses());
    }

    @GetMapping("/offerings")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CourseOfferingResponse>> getOfferings() {
        return ResponseEntity.ok(studentService.getOfferings());
    }

    @GetMapping("/enrollments")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollments(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(studentService.getMyEnrollments(email));
    }

    @PostMapping("/enroll/{offeringId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<EnrollmentResponse> enroll(@PathVariable Integer offeringId, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(studentService.enroll(offeringId, email));
    }

    @PatchMapping("/enrollments/{enrollmentId}/drop")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> dropEnrollment(@PathVariable Integer enrollmentId, Authentication authentication) {
        String email = authentication.getName();
        studentService.dropEnrollment(enrollmentId, email);
        return ResponseEntity.ok("Enrollment dropped successfully");
    }

}
