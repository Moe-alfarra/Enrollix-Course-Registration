package com.moeAlfarra.course_registration_platform.dto;

import com.moeAlfarra.course_registration_platform.entity.EnrollmentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor
@AllArgsConstructor
public class ProfessorStudentResponse {
    private Integer studentId;
    private String name;
    private String email;
    private EnrollmentStatus status;
    private LocalDateTime enrolledAt;
}
