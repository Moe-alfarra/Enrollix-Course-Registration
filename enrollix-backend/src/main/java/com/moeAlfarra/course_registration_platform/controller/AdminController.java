package com.moeAlfarra.course_registration_platform.controller;


import com.moeAlfarra.course_registration_platform.dto.CourseRequest;
import com.moeAlfarra.course_registration_platform.dto.CourseResponse;
import com.moeAlfarra.course_registration_platform.dto.CreateUserRequest;
import com.moeAlfarra.course_registration_platform.dto.UserResponse;
import com.moeAlfarra.course_registration_platform.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ADMIN Endpoints

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;


    @PostMapping("/courses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseResponse> createCourse(@RequestBody CourseRequest request) {
        return ResponseEntity.ok(adminService.createCourse(request));
    }
    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> createProfessor(@RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(adminService.createUser(request));
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Integer userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully");
    }

    @GetMapping("/courses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        return ResponseEntity.ok(adminService.getAllCourses());
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUser(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(adminService.getUser(email));
    }

    @GetMapping("/courses/deleted")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CourseResponse>> getAllDeletedCourses() {
        return ResponseEntity.ok(adminService.getAllDeletedCourses());
    }

    @PatchMapping("/courses/{courseId}/restore")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> restoreCourse(@PathVariable Integer courseId) {
        adminService.restoreCourse(courseId);
        return ResponseEntity.ok("Course restored successfully");
    }

    @DeleteMapping("/courses/{courseId}/soft-delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> softDelete(@PathVariable Integer courseId) {
        adminService.softDeleteCourse(courseId);
        return ResponseEntity.ok("Course deleted successfully");
    }
    @DeleteMapping("/courses/{courseId}/hard-delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> hardDelete(@PathVariable Integer courseId) {
        adminService.hardDeleteCourse(courseId);
        return ResponseEntity.ok("Course removed successfully from system");
    }



}
