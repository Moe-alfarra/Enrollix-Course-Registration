package com.moeAlfarra.course_registration_platform.service;

import com.moeAlfarra.course_registration_platform.dto.AuthResponse;
import com.moeAlfarra.course_registration_platform.dto.LoginRequest;
import com.moeAlfarra.course_registration_platform.dto.CreateUserRequest;
import com.moeAlfarra.course_registration_platform.dto.StudentRegisterRequest;
import com.moeAlfarra.course_registration_platform.entity.Student;
import com.moeAlfarra.course_registration_platform.entity.User;
import com.moeAlfarra.course_registration_platform.repository.ProfessorRepository;
import com.moeAlfarra.course_registration_platform.repository.StudentRepository;
import com.moeAlfarra.course_registration_platform.repository.UserRepository;
import com.moeAlfarra.course_registration_platform.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;


    // Register Student
    public AuthResponse register(StudentRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));


        Student student = new Student();
        student.setUser(user);
        user.setStudent(student);

        userRepository.save(user);
        String token = jwtUtil.generateToken(user);

        return new AuthResponse(user.getUserId(), user.getName(), user.getEmail(),user.getRole(), token);

    }

    // Login for all users (ADMIN, PROFESSOR & STUDENT)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String token = jwtUtil.generateToken(user);

        return new AuthResponse(user.getUserId(), user.getName(), user.getEmail(),user.getRole(), token);
    }


}
