package com.moeAlfarra.course_registration_platform.dto;

import com.moeAlfarra.course_registration_platform.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
public class AuthResponse {
    private Integer userId;
    private String name;
    private String email;
    private Role role;
    private String token;


}
