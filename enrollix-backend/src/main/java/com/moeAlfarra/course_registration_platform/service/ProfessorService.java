package com.moeAlfarra.course_registration_platform.service;

import com.moeAlfarra.course_registration_platform.dto.*;
import com.moeAlfarra.course_registration_platform.entity.*;
import com.moeAlfarra.course_registration_platform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CourseOfferingRepository courseOfferingRepository;
    private  final ProfessorRepository professorRepository;
    private final EnrollmentRepository enrollmentRepository;



    // Get user for profile
    public UserResponse getUser(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return new UserResponse(user.getUserId(), user.getName(), user.getEmail(), user.getRole());
    }

    // Get All courses in system
    public List<CourseResponse> getCourses() {
        // Get courses
        List<Course> courses = courseRepository.findByDeletedFalse();

        // Filter for CoursesResponse
        List<CourseResponse> coursesList = new ArrayList<>();
        for (Course course: courses) {
            coursesList.add(new CourseResponse(course.getCourseId(), course.getCode(),
                    course.getName(), course.getDescription(), course.getCredits()));
        }

        return coursesList;
    }

    // Create Course Offering
    public CourseOfferingResponse createCourseOffering(CourseOfferingRequest request, String email) {
        // Get User
        User user = userRepository.findByEmail(email).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Get Professor
        Professor professor = professorRepository.findByUserUserId(user.getUserId()).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor not found"));

        // Get Course
        Course course = courseRepository.findById(request.getCourseId()).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        // Check for soft deleted courses
        if (course.isDeleted()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course is deleted");
        }

        // Validate Content
        if (request.getCapacity() == null || request.getCapacity() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Capacity must be greater than 0");
        }
        if (request.getSection() == null || request.getSection().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Section is required");
        }
        if (request.getYear() == null || request.getYear() < 2000) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid year");
        }
        if (request.getSemester() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Semester is required");
        }

        // Check for duplicate based on (Course, Professor, Semester & Year)
        if (courseOfferingRepository.existsByCourseAndSemesterAndYearAndSectionAndProfessor
                (course, request.getSemester(), request.getYear(), request.getSection(), professor)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Offering already exists");
        }

        // Create Offering
        CourseOffering offering = new CourseOffering();

        offering.setCourse(course);
        offering.setProfessor(professor);
        offering.setSemester(request.getSemester());
        offering.setSection(request.getSection());
        offering.setYear(request.getYear());
        offering.setCapacity(request.getCapacity());
        offering.setEnrolledCount(0);

        CourseOffering saved = courseOfferingRepository.save(offering);

        // Return response
        return new CourseOfferingResponse(saved.getOfferingId(), course.getCode(),
                course.getName(), course.getCredits(), saved.getSemester(),
                saved.getYear(), saved.getSection(), saved.getCapacity(), saved.getEnrolledCount(), null);
    }

    // Get All Offerings for Professor
    public List<CourseOfferingResponse> getMyOfferings(String email) {
        // Get User
        User user = userRepository.findByEmail(email).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Get Professor
        Professor professor = professorRepository.findByUserUserId(user.getUserId()).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor not found"));

        // Get List of Professor offerings
        List<CourseOffering> offerings = courseOfferingRepository.findByProfessorProfessorId(professor.getProfessorId());
        List<CourseOfferingResponse> offeringsResponse = new ArrayList<>();

        // Convert CourseOfferings List to CourseOfferings Response
        for (CourseOffering courseOffering: offerings) {
            Course course = courseOffering.getCourse();
            offeringsResponse.add(new CourseOfferingResponse(
                    courseOffering.getOfferingId(), course.getCode(),
                    course.getName(), course.getCredits(), courseOffering.getSemester(),
                    courseOffering.getYear(), courseOffering.getSection(),
                    courseOffering.getCapacity(), courseOffering.getEnrolledCount(), null));
        }

        return offeringsResponse;
    }

    // Get Students Enrolled in Offering
    public List<ProfessorStudentResponse> getStudentsForOffering(Integer offeringId, String email) {
        // Get User
        User user = userRepository.findByEmail(email).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Get Professor
        Professor professor = professorRepository.findByUserUserId(user.getUserId()).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor not found"));

        // Get offering
        CourseOffering offering = courseOfferingRepository.findById(offeringId).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Offering not found"));

        // Verify Ownership
        if (!offering.getProfessor().getProfessorId().equals(professor.getProfessorId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only view students for your own offerings");
        }

        // Get enrollments for specific course offering

        List<Enrollment> enrollments = enrollmentRepository.findByOffering(offering);
        List<ProfessorStudentResponse> courseEnrollments = new ArrayList<>();

        for (Enrollment enrollment: enrollments) {
            Student student = enrollment.getStudent();
            User studentUser = student.getUser();

            ProfessorStudentResponse response= new ProfessorStudentResponse(
                    student.getStudentId(), studentUser.getName(), studentUser.getEmail(),
                    enrollment.getStatus(), enrollment.getEnrolledAt());

            courseEnrollments.add(response);
        }
        return courseEnrollments;
    }

    // Delete Offering
    public void deleteOffering(Integer offeringId, String email) {
        // Get User
        User user = userRepository.findByEmail(email).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Get Professor
        Professor professor = professorRepository.findByUserUserId(user.getUserId()).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor not found"));

        // Get offering
        CourseOffering offering = courseOfferingRepository.findById(offeringId).orElseThrow(()
                -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Offering not found"));

        // Verify Ownership
        if (!offering.getProfessor().getProfessorId().equals(professor.getProfessorId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own offerings");
        }

        // Check if enrollments exist
        if (enrollmentRepository.existsByOffering(offering)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cannot delete offering with enrolled students"
            );
        }

        courseOfferingRepository.delete(offering);
    }

    public void updateOffering(Integer offeringId, UpdateCourseOfferingRequest request, String email) {
        // Get User
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Get Professor
        Professor professor = professorRepository.findByUserUserId(user.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor not found"));

        // Get Offering
        CourseOffering offering = courseOfferingRepository.findById(offeringId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Offering not found"));

        // Verify ownership
        if (!offering.getProfessor().getProfessorId().equals(professor.getProfessorId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only edit your own offerings");
        }

        // Update capacity
        if (request.getCapacity() != null) {
            if (request.getCapacity() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Capacity must be greater than 0");
            }
            if (request.getCapacity() < offering.getEnrolledCount()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Capacity cannot be less than the number of enrolled students"
                );
            }
            offering.setCapacity(request.getCapacity());
        }

        // Update section
        if (request.getSection() != null && !request.getSection().trim().isEmpty()) {
            offering.setSection(request.getSection().trim());
        }

        // Update semester
        if (request.getSemester() != null) {
            offering.setSemester(request.getSemester());
        }

        // Update year
        if (request.getYear() != null) {
            if (request.getYear() < 2000) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid year");
            }
            offering.setYear(request.getYear());
        }

        courseOfferingRepository.save(offering);
    }
}
