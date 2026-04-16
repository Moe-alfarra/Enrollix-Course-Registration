package com.moeAlfarra.course_registration_platform.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CourseResponse {

    private Integer courseId;
    private String code;
    private String name;
    private String description;
    private Integer credits;
}
