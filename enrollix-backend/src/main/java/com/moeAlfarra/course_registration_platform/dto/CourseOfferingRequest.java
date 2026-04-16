package com.moeAlfarra.course_registration_platform.dto;

import com.moeAlfarra.course_registration_platform.entity.Semester;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor
public class CourseOfferingRequest {
    private Integer courseId;
    private Semester semester;
    private Integer year;
    private String section;
    private Integer capacity;
}
