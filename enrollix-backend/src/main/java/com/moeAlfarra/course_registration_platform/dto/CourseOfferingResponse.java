package com.moeAlfarra.course_registration_platform.dto;

import com.moeAlfarra.course_registration_platform.entity.Semester;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class CourseOfferingResponse {

    private Integer offeringId;
    private String courseCode;
    private String courseName;
    private Integer credits;
    private Semester semester;
    private Integer year;
    private String section;
    private Integer capacity;

    private Integer enrolledCount;
    private String professorName;

}
