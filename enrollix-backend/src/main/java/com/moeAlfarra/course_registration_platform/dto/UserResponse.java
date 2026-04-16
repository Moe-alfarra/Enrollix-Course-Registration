package com.moeAlfarra.course_registration_platform.dto;

import com.moeAlfarra.course_registration_platform.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor
public class UserResponse {
    private Integer userId;
    private String name;
    private String email;
    private Role role;
}
