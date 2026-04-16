package com.moeAlfarra.course_registration_platform.service;

import com.moeAlfarra.course_registration_platform.dto.CourseRequest;
import com.moeAlfarra.course_registration_platform.dto.CourseResponse;
import com.moeAlfarra.course_registration_platform.dto.CreateUserRequest;
import com.moeAlfarra.course_registration_platform.dto.UserResponse;
import com.moeAlfarra.course_registration_platform.entity.*;
import com.moeAlfarra.course_registration_platform.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;
    private final PasswordEncoder passwordEncoder;

    // Create user (Student, Professor, or admin)
    public UserResponse createUser(CreateUserRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        if (request.getRole() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role is required");
        }


        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        switch (request.getRole()) {
            case STUDENT -> {
                Student student = new Student();
                student.setUser(user);
                user.setStudent(student);
            }
            case PROFESSOR -> {
                Professor professor = new Professor();
                professor.setUser(user);
                user.setProfessor(professor);
            }
            case ADMIN -> {
                // no linked entity needed
            }
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role");
        }


        User savedUser = userRepository.save(user);

        return new UserResponse(savedUser.getUserId(), savedUser.getName(),
                savedUser.getEmail(), savedUser.getRole());
    }

    // Course Creation
    public CourseResponse createCourse(CourseRequest request) {
        if (courseRepository.existsByCode(request.getCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course code already exists");
        }
        if (courseRepository.existsByName(request.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course name already exists");
        }
        Course course = new Course();
        course.setCode(request.getCode());
        course.setName(request.getName());
        course.setDescription(request.getDescription());
        course.setCredits(request.getCredits());

        Course savedCourse = courseRepository.save(course);

        return new CourseResponse(savedCourse.getCourseId(),
                savedCourse.getCode(), savedCourse.getName(), savedCourse.getDescription(), savedCourse.getCredits());

    }

    // List all courses for admin
    public List<CourseResponse> getAllCourses() {
        List<CourseResponse> courseResponses = new ArrayList<>();
        List<Course> courses = courseRepository.findByDeletedFalse();
        for (Course course: courses) {
            courseResponses.add(new CourseResponse(course.getCourseId(), course.getCode(),
                    course.getName(), course.getDescription(), course.getCredits()));
        }

        return courseResponses;
    }

    // List all soft-deleted courses for admin
    public List<CourseResponse> getAllDeletedCourses() {
        List<CourseResponse> deletedCourseResponses = new ArrayList<>();
        List<Course> deletedCourses = courseRepository.findByDeletedTrue();
        for(Course course: deletedCourses) {
            deletedCourseResponses.add(new CourseResponse(course.getCourseId(), course.getCode(),
                    course.getName(), course.getDescription(), course.getCredits()));
        }
        return deletedCourseResponses;
    }

    // Restore course
    public void restoreCourse(Integer courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        if (!course.isDeleted()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course not deleted");
        }
        course.setDeleted(false);
        courseRepository.save(course);
    }

    // Get user for profile
    public UserResponse getUser(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return new UserResponse(user.getUserId(), user.getName(), user.getEmail(), user.getRole());
    }

    // List all users for admin
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserResponse> userResponses = new ArrayList<>();

        for (User currentUser: users) {
            userResponses.add(new UserResponse(currentUser.getUserId(), currentUser.getName(),
                    currentUser.getEmail(), currentUser.getRole()));
        }

        return userResponses;
    }

    // Delete user
    @Transactional
    public void deleteUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        switch (user.getRole()) {
            case STUDENT -> {
                Student student = studentRepository.findByUserUserId(userId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

                if (!student.getEnrollments().isEmpty()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete student with enrollments");
                }

                userRepository.delete(user);
            }

            case PROFESSOR -> {
                Professor professor = professorRepository.findByUserUserId(userId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor not found"));

                if (!professor.getCourseOfferings().isEmpty()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete professor with offerings");
                }

                userRepository.delete(user);
            }

            case ADMIN -> {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete admin");
            }
        }
    }


    // Soft Delete courses
    public void softDeleteCourse(Integer courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        course.setDeleted(true);
        courseRepository.save(course);
    }

    // Hard Delete Course
    public void hardDeleteCourse(Integer courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        courseRepository.delete(course);
    }



}
