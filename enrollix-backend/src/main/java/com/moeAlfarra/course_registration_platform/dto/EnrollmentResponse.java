package com.moeAlfarra.course_registration_platform.dto;


import com.moeAlfarra.course_registration_platform.entity.EnrollmentStatus;
import com.moeAlfarra.course_registration_platform.entity.Semester;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentResponse {
    private Integer enrollment_id;
    private Integer student_id;
    private Integer offering_id;
    private String courseCode;
    private String courseName;
    private Integer credits;
    private Semester semester;
    private Integer year;
    private EnrollmentStatus status;
    private String grade;
    private String section;
    private String professorName;
    private LocalDateTime enrolledAt;
    private LocalDateTime droppedAt;
    private LocalDateTime completedAt;
}
