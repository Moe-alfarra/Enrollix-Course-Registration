package com.moeAlfarra.course_registration_platform.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CourseRequest {
    private String code;
    private String name;
    private String description;
    private int credits;

}
